const mongoose = require('mongoose')

module.exports = mongoose.model('Session', mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: "User"}
}, {
    toJSON: {
        transform: (docIn, docOut) => {
            docOut.id = docOut._id
            delete docOut._id
            delete docOut.__v
        }
    }
}))