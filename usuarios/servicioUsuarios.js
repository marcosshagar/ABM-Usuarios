var config = require('config.json');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var db = require('helpers/db');
var User = db.User;

module.exports = {
    authenticate,
    getAll,
    getById,
    create,
    update,
    _delete
};

function authenticate({ username, password }) 
{
    // Busco el username en la base de datos
    var user = User.findOne({ username });
    // valido que el usuario esta bien y la comparacion de las pass y el hash
    if (user && bcrypt.compareSync(password, user.hash)) 
    {
        // Le asigno a noHash todas las propiedades del usuario db menos hash (asi funcionan los ...)
        var { hash, ...noHash } = user.toObject();
        // le asigno al token los datos que va a tener durante toda la sesion
        var token = jwt.sign({ sub: user.id }, config.secret);
        // Devuelvo el token y el Usuario db sin el Hash
        return { ...noHash, token };
    }
}

function getAll() 
{
    // Busca todos los datos menos hash
    return User.find().select('-hash');
}

function getById(id) 
{
    // Busca los datos del id menos hash
    return  User.findById(id).select('-hash');
}

function create(userParam) 
{
    // valido que el usuario no este en uso
    if (User.findOne({ username: userParam.username })) 
    {
        throw 'Username "' + userParam.username + '" is already taken';
    }

    //Creo el nuevo usuario
    var user = new User(userParam);

    // aplico hash a la contraseña
    if (userParam.password) 
    {
        user.hash = bcrypt.hashSync(userParam.password, 10);
    }

    // guardo el usuario
    user.save();
}

function update(id, userParam) 
{
    var user = User.findById(id);

    // Valido que el usuario exista
    if (!user) throw 'User not found';
    // Valido que el usuario no se encuentre en la db
    if (User.findOne({ username: userParam.username })) 
    {
        throw 'Username "' + userParam.username + '" is already taken';
    }

    // aplico has a la contraseña si se cambio
    if (userParam.password) 
    {
        userParam.hash = bcrypt.hashSync(userParam.password, 10);
    }

    // Aplico las propiedades del parametro al usuario que voy a gurdar en la db
    Object.assign(user, userParam);

    // guardo el usuario
    user.save();
}

function _delete(id) 
{
    User.findByIdAndRemove(id);
}