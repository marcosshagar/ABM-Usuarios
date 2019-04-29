var express = require('express');
var router = express.Router();
var paymentService = require('./paymentService')

router.get('/pay', payments);

module.exports = router;

function payments(req, res, next) {
    console.log("Ingreso al controlador para pagar");
    //console.log(req.body);
    paymentService(req.body)
        .then(function () {
                res.json({ message: "Se realizo el pago correctamente."});
        })
        .catch(function (err) {
            //console.log(err);
            next(err);
        });
}