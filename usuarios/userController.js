var express = require('express');
var router = express.Router();
var userService = require('./userService');

// Defino las rutas paras las acciones a realizar
router.post('/authenticate', authenticate);
router.post('/create', create);
router.get('/', getAll); //Admin
router.get('/me', sesionUser);
router.get('/:id', getUser); //Admin
router.put('/:id', update);
router.delete('/:id', _delete);

module.exports = router;

//----- FUNCION PARA AUTENTICAR UN USUARIO -----
function authenticate(req, res, next) {
    userService.authenticate(req.body)
        .then(function (user) {
            if (user) {
                res.json(user);
            } else {
                res.status(400).json({message: "Usuario o Contraseña incorrecta"});
            }
        })
        .catch(function (err) {
            next(err);
        });
}

//----- FUNCION PARA CREAR UN USUARIO -----
function create(req, res, next) {
    console.log("inicio registro");
    userService.create(req.body)
        .then(function(){
            res.json({ message: "Se registro el usuario " + req.body.username + " correctamente."});
        })
        .catch(function (err) {
            next(err);
        });
}

//----- FUNCION PARA OBTENER UN USUARIO ESPECIFICO -----
function getUser(req, res, next) {
    userService.getById(req.user.role, req.params.id)
        .then(function(user){
            if(user){
                console.log("Usuario encontrado")
                res.json(user);
            } else {
                console.log("Sending Status")
                res.status(404).json({message: "Usuario no encontrado"});
            }
        })
        .catch(function(err){
            next(err);
        });
}

//----- FUNCION PARA OBTENER EL USUARIO DE LA SESION ACTUAL -----
function sesionUser(req, res, next) {
    userService.getById(req.user.sub)
        .then(function(user){
            if(user){
                res.json(user);
            } else {
                console.log("envio Not Found");
                res.sendStatus(404);
            }
        })
        .catch(function(err){
            console.log(err);
            next(err);
        });
}

//----- FUNCION PARA MODIFICAR LOS DATOS DEL USUARIO -----
function update(req, res, next){
    userService.update(req.params.id, req.body)
    .then(function(){
        res.json({message: "Se modificaron los datos del Usuario"});
    })
    .catch(function(err){
        next(err);
    });
}

//----- FUNCION PARA ELIMINAR UN USUARIO -----
function _delete(req, res, next){
    userService._delete(req.params.id)
    .then(function(){
        res.json({message: "Se elimino el usuario"});
    })
    .catch(function(err){
        next(err);
    });
}

//----- FUNCION PARA OBTENER TODOS LOS USUARIOS EXISTENTES -----
function getAll(req, res, next) {
    userService.getAll(req.user.role)
        .then(function(users){
            res.json(users);
        })
        .catch(function(err){
            next(err);
        });
}