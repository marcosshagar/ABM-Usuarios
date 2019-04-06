var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchma = new Schema({
    username: { type: String, unique: true, required: true },
    hash: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    createdDate: { type: Date, default: Date.now }
});

userSchma.set('toJSON', {virtuals: true});

module.exports = mongoose.model('User', userSchma);