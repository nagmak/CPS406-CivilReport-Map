var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var Account = new Schema({
    username: String,
    password: String,
    probDesc: String,
    probType: String,
    email: String,
    lat: Number,
    long: Number,
    timeStamp: Number
});

Account.plugin(passportLocalMongoose);

module.exports = mongoose.model('accounts', Account);