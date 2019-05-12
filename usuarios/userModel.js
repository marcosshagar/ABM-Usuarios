//Marcos Shanahan

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    username: { type: String, unique: true, required: true },
    hash: { type: String, required: true },
    nombre: { type: String, required: true },
    apellido: { type: String, required: true },
    createdDate: { type: Date, default: Date.now },
    role: {type: String, default: 'User'}
});

userSchema.set('toJSON', {virtuals: true});

module.exports = mongoose.model('User', userSchema);