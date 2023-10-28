const mongoose = require('mongoose');

const Accounts = mongoose.model('accounts',{
    Name: { type: String, required: true, unique: true },
    Pass: { type: Object },
    iD: { type: Number },
    _id: { type: String},
})

//Count how many players registered
Accounts.countDocuments({}, function(err, result) {
    console.log("Total Players Registered " +result)
    totalPlayers = result
    module.exports = totalPlayers
})

module.exports = Accounts