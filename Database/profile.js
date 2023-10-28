const mongoose = require('mongoose');

const Profiles = mongoose.model('profiles',{
    Age: { type: Number },
    Health: { type: Number },
    Damage: { type: Number },
    iD: { type: Number },
    Name: { type: String , required: true, unique: true},
    _id: { type: String},
    xx: { type: Number },
    yy: { type: Number },
})

module.exports = Profiles