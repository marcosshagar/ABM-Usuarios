var express = require('express');
var router = express.Router();
var request = require('superagent');

router.post('/pay', payments);

module.exports = router;

function payments(req, res, next) {
    console.log("Ingreso al controlador para pagar");

    console.log("Comienzo el request");
    request.post("https://api.mercadopago.com/v1/payments?access_token=TEST-7094732018586761-042619-0460da5877116609ef45498be16d8e41-221281264")
        .send(req.body)
        .set('Content-Type', 'application/json')
        .then(function (payStatus) {
                console.log("Se RealiZo el pago")
                res.send(payStatus);
        }).catch(function(err){
            next(err.response.body.message);
        });
}