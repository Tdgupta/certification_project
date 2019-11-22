const mongoose = require('mongoose');
var adminSchema = mongoose.Schema({
    username : {type:String, required: true},
    password : {type:String, required: true},
},{timestamps: true})

module.exports = mongoose.model('Admin', adminSchema);