var express = require('express');
var router = express.Router();
var userService = require('./servicioUsuarios');

// Defino las rutas paras las acciones a realizar
router.post('/login', authenticate);
router.post('/registrarse', register);
// router.get('/', getAll);
// router.get('/current', getCurrent);
// router.get('/:id', getById);
// router.put('/:id', update);
// router.delete('/:id', _delete);

module.exports = router;

function authenticate(req, res, next) 
{
    userService.authenticate(req.body)
        .then(function (user) {
            if (user) {
                res.json(user);
            } else {
                res.status(400).json({message: 'Usuario o Contraseña incorrecta'})
            }
        })
        .catch(function (err) {
            next(err);
        });
}

function register(req, res, next) {
    userService.create(req.body)
        .then(function(){
            res.json({message: "Se registro el usuario " + req.body.username + ' correctamente'});
        })
        .catch(function (err) {
            next(err);
        });

}