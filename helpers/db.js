const config = require('config.json');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

mongoose.connect(process.env.MONGODB_URI || config.connectionString, { useCreateIndex: true, useNewUrlParser: true }, function(err, ok) {
    console.log("El Servidor MongoDB esta Conectado", ok, err);
});

mongoose.set('useFindAndModify', false);

module.exports ={
     User: require('../usuarios/modeloUsuarios')
};
