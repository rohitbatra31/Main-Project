const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');


const userschema = new Schema({
    email:{
        type:String,
        required:true
    },
});

userschema.plugin(passportLocalMongoose);  // this will create username and hashed salt passwords for users
module.exports = mongoose.model('User', userschema);

