const router = require("express").Router();
const User = require("../models/User");
const Account = require("../models/Account");
const Bank = require("../models/Bank");
const Transaction = require("../models/Transaction");
const {verifyToken, refreshListOfBanksFromCentralBank} = require("../middlewares");

function debitAccount(accountFrom, amount) {
    accountFrom.balance -= amount;
    accountFrom.save()
}

router.post('/', verifyToken, async function (req, res) {
    try {

        let statusDetail;

       // const accountTo = await Account.findOne({number: req.body.accountTo})

        //404 accountFrom not found
        const accountFrom = await Account.findOne({number: req.body.accountFrom, userId: req.userId})
        if(!accountFrom){
            return res.status(404).send({error: "accountFrom not found"})
        }

        //402 Insufficient funds
        if (req.body.amount > accountFrom.balance){
            return res.status(402).send({error: "Insufficient funds"})
        }

        // Get accountTo bank prefix
        const bankToPrefix = req.body.accountTo.slice(0, 3)

        let bankTo = await Bank.findOne({bankPrefix: bankToPrefix})

        if(!bankTo){
            //Refresh the list of banks from central bank
            const result = await refreshListOfBanksFromCentralBank()

            if(typeof result.error !== 'undefined') {

                console.log('There was an error communicating with central bank')
                console.log(result.error)
                statusDetail = result.error

            } else {

                //Try again (after bank lost has been refreshed)
                let bankTo = await Bank.findOne({bankPrefix: bankToPrefix})

                if(!bankTo){
                    return res.status(400).json({error: 'Invalid destination bank'})
                }
            }

        } else{
            console.log('Bank was cached')
        }
        //Throw new Error('Test')
        //Add a transaction to DB
        await new Transaction({
            userId: req.userId,
            amount: req.body.amount,
            currency: accountFrom.currency,
            accountFrom: req.body.accountFrom,
            accountTo: req.body.accountTo,
            explanation: req.body.explanation,
            statusDetail: statusDetail,
            senderName: (await User.findOne({id: req.userId})).name,
        }).save()

        //Subtract amount from account
        debitAccount(accountFrom, req.body.amount);

        //201 Created
        return res.status(201).end()

    } catch (e) {

        //400 Invalid amount
        if (/.*Cast to Number failed for value .*amount/.test(e.message)
            || /Transaction validation failed: amount.*/.test(e.message)) {
            return res.status(400).send({error: 'Invalid amount'})
        }

        //400 Bad request
        if (/Transaction validation failed: .+/.test(e.message))
        {
            return res.status(400).send({error: e.message})
        }

        //500 Don't know what happened - internal server error
        console.log(e.message)
        return res.status(500).send({error: e.message})
    }
})

router.post('/b2b', async(req, res) => {
    return res.send({error: "error"})
})

module.exports = router