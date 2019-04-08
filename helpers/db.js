const config = require('config.json');
var mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI || config.connectionString, { useCreateIndex: true, useNewUrlParser: true }, function() {
    console.log("El Servidor MongoDB esta Conectado")
});

module.exports ={
     User: require('../usuarios/modeloUsuarios')
};
