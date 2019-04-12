var express = require('express');
var router = express.Router();
var userService = require('./servicioUsuarios');

// Defino las rutas paras las acciones a realizar
router.post('/authenticate', authenticate);
router.post('/registrarse', register);
// router.get('/', getAll); //Admin
router.get('/me', sesionUser);
router.get('/:id', getUser); //Admin
router.put('/:id', update);
router.delete('/:id', _delete);

module.exports = router;

function authenticate(req, res, next) {
    userService.authenticate(req.body)
        .then(function (user) {
            if (user) {
                res.json(user);
            } else {
                res.status(400).json({message: "Usuario o Contraseña incorrecta"})
            }
        })
        .catch(function (err) {
            next(err);
        });
}

function register(req, res, next) {
    console.log("inicio registro");
    userService.create(req.body)
        .then(function(){
            res.json({ message: "Se registro el usuario " + req.body.username + " correctamente."});
        })
        .catch(function (err) {
            next(err);
        });
}

function getUser(req, res, next) {
    userService.getById(req.params.id)
        .then(function(user){
            if(user){
                res.json(user);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function(err){
            next(err);
        });
}

function sesionUser(req, res, next) {
    userService.getById(req.user.sub)
        .then(function(user){
            if(user){
                res.json(user);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function(err){
            next(err);
        });
}

function update(req, res, next){
    userService.update(req.params.id, req.body)
    .then(function(){
        res.json({message: "Se modificaron los datos del Usuario"});
    })
    .catch(function(err){
        next(err);
    });
}

function _delete(req, res, next){
    userService._delete(req.params.id)
    .then(function(){
        res.json({message: "Se elimino el usuario"});
    })
    .catch(function(err){
        next(err);
    });

}