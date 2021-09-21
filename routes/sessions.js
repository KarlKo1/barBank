const router = require("express").Router()
const Session = require("../models/Session")
const User = require("../models/User")
const bcrypt = require("bcrypt");
const {verifyToken} = require('../middlewares')

router.post('/', async function (req, res) {

    try {

        // Retrieve user from MongoDB by username
        const user = await User.findOne({username: req.body.username})

        // Validate username and password
        if (!user
            || typeof req.body.password === 'undefined'
            || !await bcrypt.compare(req.body.password, user.password)) {
            return res.status(401).send({error: 'Invalid credentials'})
        }

        // Create session into database
        const session = await new Session({userId: user.id}).save()

        // 201 Created
        return res.status(201).send({token: session.id});

    } catch (e) {

        // 400 Required parameter missing
        if (/User validation failed: .*: Path `.*` is required/.test(e.message)) {
            return res.status(400).send({error: e.message})
        }

        // 500
        return res.status(500).send({error: e.message});

    }

})

router.delete('/', verifyToken, async function (req, res) {

    try {

        // Try to find the session
        const session = await Session.findOne({_id: req.sessionId.toString()})

        // Remove session from MongoDB
        await Session.deleteOne({_id: session.id.toString()})

        // 204 No content
        return res.status(204).end()

    } catch (e) {

        // 500 Internal server error
        return res.status(500).send({error: e.message})
    }
})

module.exports = router