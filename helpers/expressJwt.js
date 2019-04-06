var expressJwt = require('express-jwt');
var config = require('config.json');
var userService = require('../usuarios/servicioUsuarios');

module.exports = expressJwt;

function jwt() 
{
    var secret = config.secret;

    // Devuelvo la Clave secreta a menos que sean estas Rutas
    return expressJwt({ secret }).unless({
        //Son rutas que no necesitan autenticacion
        path: [ '/usuarios/authenticate', '/usuarios/register' ]
    });
}