//Marcos Shanahan

var config  = require('config.json');
var jwt     = require('jsonwebtoken');
var bcrypt  = require('bcryptjs');
var db      = require('helpers/db');
var User    = db.User;
var validateData = require('helpers/validate_data');

module.exports = {
    authenticate,
    getAll,
    getById,
    create,
    update,
    _delete
};

//------ FUNCION AUTHENTICATE ----------------
async function authenticate({ username, password }) {
    // Busco el username en la base de datos
    var user = await User.findOne({ username });
    // valido que el usuario esta bien y que pass coincida con la pasword hasheada
    if (user && bcrypt.compareSync(password, user.hash)) {
        // Le asigno a noHash todas las propiedades del usuario db menos hash (asi funcionan los ...)
        var { hash, ...noHash } = user.toObject();
        // le asigno al token los datos que va a usar durante toda la sesion
        var token = jwt.sign({ sub: user.id, role: user.role }, config.secretPass, {expiresIn: '2h'});
        // Devuelvo el token y el Usuario db sin la contraseña hasheada
        return { ...noHash,
                 token };
    }
}

//------ FUNCION GET ALL ----------------
async function getAll(userRole) {
    console.log(userRole);
    if (userRole === "Admin") {
        // Busca todos los datos menos hash
        return await User.find().select('-hash');
    } else {
        errorModel = {
            name: "Forbidden",
            message: "No tiene permisos de Administrador"
        };

        throw errorModel;
    }
}

//------ FUNCION GET ByID ----------------
async function getById(userRole, id) {
    console.log(userRole);
    if (userRole === "Admin") {
        // Busca los datos del id menos hash
        return await User.findById(id).select('-hash');
    } else {
        errorModel = {
            name: "Forbidden",
            message: "No tiene permisos de Administrador"
        };

        throw errorModel;
    }
}

//------ FUNCION CREATE ----------------
async function create(userParam) {
    console.log("creando usuario", userParam);
    // valido que el usuario no este en uso
    if (await User.findOne({ username: userParam.username }))
        throw 'El usuario ' + userParam.username + ' no esta disponible';
    
    // Valido el Usuario
    validateData.validarUsername(userParam.username);
    // Valido la Contraseña
    validateData.validarPassword(userParam.password);

    //Creo el nuevo usuario con los datos del usuario del request
    var user = new User(userParam);

    // aplico hash a la contraseña
    if (userParam.password) {
        console.log("encripto");
        user.hash = bcrypt.hashSync(userParam.password, 10);
    }
 
    console.log("guardo el nuevo usuario");
    await user.save();
}

//------ FUNCION UPDATE ----------------
async function update(id, userParam) {
    var user = await User.findById(id);

    // Valido que el usuario exista
    if (!user) throw 'Usuario no encontrado';
    // Valido que el usuario nuevo sea diferente al que ya existe y no este en la base
    if (userParam.username || userParam.role) {

        errorModel = {
            name: "Forbidden",
            message: "No se pueden modificar Usuario ni Rol"
        };

        throw errorModel;
    }

    // verifico que sea valida y aplico hash a la contraseña si se cambio
    if (userParam.password) {
        validarPassword(userParam.password);
        userParam.hash = bcrypt.hashSync(userParam.password, 10);
    }

    await User.findByIdAndUpdate(id, userParam);
}

//------ FUNCION DELETE ----------------
async function _delete(id) {
   var user = await User.findByIdAndRemove(id);
   if (!user) throw 'El usuario no Existe';
}