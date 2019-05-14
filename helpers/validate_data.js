//Marcos Shanahan

var DataValidator = require('password-validator');
var passValidators = new DataValidator();
var userValidators = new DataValidator();

passValidators
.is().min(8)                           
.is().max(20)                                 
.has().uppercase()                             
.has().lowercase()                            
.has().digits()                                
.has().not().spaces();

userValidators
.is().min(5)                           
.is().max(20)                                                               
.has().not().spaces();

module.exports = {
    validarPassword,
    validarUsername
};

function validarPassword (password){
    console.log("validando contraseña");
    var validarPass = passValidators.validate(password);
    console.log(validarPass);

    if (validarPass){
        return password;
    } else {
        throw "La contraseña debe tener entre 8 y 20 caracteres, mayusculas, minusculas y digitos"
    }
}

function validarUsername (username){
    console.log("validando contraseña");
    var validarUser = userValidators.validate(username);
    console.log(validarUser);

    if (validarUser){
        return username;
    } else {
        throw "El Usuario debe tener entre 5 y 20 caracteres, y no puede contener espacios"
    }
}