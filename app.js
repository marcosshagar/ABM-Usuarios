require('rootpath')();
var express = require('express');
var app = express();
var cors = require('cors');
var bodyParser = require('body-parser');
var exJwt = require('helpers/expressJwt')
var errorHandler = require('helpers/error_handler')

//app.use significa que siempre el request que se haga va a pasar por ahi
// Soporta URL post data
app.use(bodyParser.urlencoded({ extended: true}));
// Soporta aplication/json type post data
app.use(bodyParser.json());
// cors me permite recibir un request desde otros dominios diferentes al mio
app.use(cors());
// Autenticacion a la Api
app.use(exJwt());
// Ruta Principal de las acciones/metodos de usuarios
app.use('/usuarios', require('./usuarios/userController'));
// Ruta para realizar pagos
app.use('/payment', require('./payments/paymentController'));
// Menejo de errores
app.use(errorHandler);

if (process.env.NODE_ENV === 'production') {
    port = process.env.PORT || 80;
} else {
    port = 5000;
}

app.listen(port, function () {
    console.log("Server listening on port " + port);
});
