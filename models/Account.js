const mongoose = require('mongoose')

module.exports = mongoose.model('Account', mongoose.Schema({
        name: {type: String, required: true, min: 2, max: 255, default: 'Main'},
        number: {
            type: String,
            required: true,
            min: 11,
            max: 11,
            default: function () {
                return process.env.BANK_PREFIX + require('md5')(new Date().toISOString())
            }
        },
        userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        balance: {type: Number, required: true, default: 10000},
        currency: {type: String, required: true, default: 'USD'},
        createdAt: {type: Date, default: new Date()}
    },
    {
        toJSON: {
            transform: (docIn, docOut) => {
                docOut.id = docOut._id
                delete docOut._id
                delete docOut.__v
            }
        }
    }
))