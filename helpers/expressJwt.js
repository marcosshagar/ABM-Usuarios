var expressJwt = require('express-jwt');
var config = require('config.json');
//var userService = require('../usuarios/servicioUsuarios');

module.exports = jwt;

function jwt() 
{
    const secret = config.secretPass;

    // Devuelvo la Clave secreta a menos que sean estas Rutas
    return expressJwt({ secret }).unless({
        //Son rutas que no necesitan autenticacion
        path: [ '/usuarios/authenticate', '/usuarios/create' ]
    });
}