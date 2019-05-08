var passwordValidator = require('password-validator');
var validators = new passwordValidator();

validators
.is().min(8)                           
.is().max(20)                                 
.has().uppercase()                             
.has().lowercase()                            
.has().digits()                                
.has().not().spaces();

module.exports = validarPassword;

function validarPassword (password){
    console.log("validando contraseña");
    var validar = validators.validate(password);
    console.log(validar);

    if (validar){
        return password;
    } else {
        throw "La contraseña debe tener entre 8 y 20 caracteres, mayusculas, minusculas y digitos"
    }
}