const mongoose = require('mongoose')

module.exports = mongoose.model('Transaction', mongoose.Schema({

    accountFrom: {type: String, required: true, minlength: 4},
    accountTo: {type: String, required: true, minlength: 4},
    amount: {type: Number, required: true, min: 0.01},
    currency: {type: String, required: true, minlength: 3},
    createdAt: {type: Date, required: true, default: Date.now},
    explanation: {type: String, required: true, minlength: 1},
    senderName: {type: String},
    receiverName: {type: String},
    status: {type: String, required: true, default: 'Pending'},
    statusDetail: {type: String}

}, {
    toJSON: {
        transform: (docIn, docOut) => {
            docOut.id = docOut._id
            delete docOut._id
            delete docOut.__v
        }
    }
}))