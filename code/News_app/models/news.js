const mongoose = require('mongoose');
var newsSchema = mongoose.Schema({
    title : {type:String, required: true},
    description : {type:Number, required: true},
    url : {type:String, required: true},
    imageurl : {type:String, required: true},
},{timestamps: true})

module.exports = mongoose.model('News', newsSchema);