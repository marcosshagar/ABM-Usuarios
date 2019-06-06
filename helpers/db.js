//Marcos Shanahan

const config = require('config.json');
var mongoose = require('mongoose');

mongoose.connect(process.env.MONGOLAB_PURPLE_URI || config.dockerConnString, { useCreateIndex: true, useNewUrlParser: true }, function(err, ok) {
    if (err) {
        //console.log(err);
        throw err;
    } else {
        //console.log(ok);
        console.log("El Servidor MongoDB esta Conectado"); 
    }
});

mongoose.Promise = global.Promise;

mongoose.set('useFindAndModify', false);

module.exports ={
     User: require('../usuarios/userModel'),
     Payment: require('../payments/paymentModel')
};
