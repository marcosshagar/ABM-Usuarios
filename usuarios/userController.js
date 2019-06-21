//Marcos Shanahan

var express     = require('express');
var router      = express.Router();
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
async function authenticate(req, res, next) {
    await userService.authenticate(req.body)
        .then(function (user) {
            if (user) {
                res.status(200).json(user);
            } else {
                //No se púede interpretar debido a sintaxis invalida
                res.status(400).json({message: "Usuario o Contraseña incorrecta"});
            }
        })
        .catch(function (err) {
            next(err);
        });
}

//----- FUNCION PARA CREAR UN USUARIO -----
async function create(req, res, next) {
    console.log("inicio registro");
    await userService.create(req.body)
        .then(function(){
            res.status(201).json({ message: "Se registro el usuario " + req.body.username + " correctamente."});
        })
        .catch(function (err) {
            next(err);
        });
}

//----- FUNCION PARA OBTENER UN USUARIO ESPECIFICO -----
async function getUser(req, res, next) {
    await userService.getById(req.user.role, req.params.id)
        .then(function(user){
            if(user){
                console.log("Usuario encontrado")
                res.status(200).json(user);
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
async function sesionUser(req, res, next) {
    await userService.getSesionUser(req.user.sub)
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
async function update(req, res, next){
    await userService.update(req.params.id, req.user.sub, req.body)
        .then(function(){
            // Ver que onda el 200
            res.status(200).json({ message: "Se modificaron los datos del Usuario" });
        })
        .catch(function(err){
            next(err);
        });
}

//----- FUNCION PARA ELIMINAR UN USUARIO -----
async function _delete(req, res, next){
    await userService._delete(req.params.id, req.user.sub, req.user.role)
    .then(function(){
        res.status(200).json({message: "Se elimino el usuario"});
    })
    .catch(function(err){
        next(err);
    });
}

//----- FUNCION PARA OBTENER TODOS LOS USUARIOS EXISTENTES -----
async function getAll(req, res, next) {
    await userService.getAll(req.user.role)
        .then(function(users){
            if(users){
                console.log("Usuarios encontrados")
                res.status(200).json(users);
            } else {
                console.log("Sending Status")
                res.status(404).json({message: "No hay Usuarios Registrados"});
            }
        })
        .catch(function(err){
            next(err);
        });
}