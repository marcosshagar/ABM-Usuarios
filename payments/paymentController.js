//Marcos Shanahan

var express = require('express');
var router = express.Router();
var paymentService = require("./PaymentService");

router.post('/pay', payments);
router.get('/:id', getPayment);
router.get('/', getAllPayments);

module.exports = router;

async function  payments(req, res, next) {
    //console.log(req);
    console.log("Ingreso al controlador para pagar");

    var paymentDto = {
        userId: req.user.sub,
        amount: req.body.amount,
        mpPaymentMethodId: req.body.mp_payment_method_id,
        dni : req.body.dni,
        mpCardToken: req.body.mp_card_token
    };

    validateBody(paymentDto);

    console.log("payment Dto", paymentDto);

    try{

        let payment = await paymentService.create(paymentDto);
        console.log(payment);
        return res.status(201).json(payment);

    } catch (err) {

        console.error("error en controlador");
        next (err);

    }
}

async function getPayment(req, res, next) {
    //paymentService.getById(req.user.role, req.user.sub, req.params.id)
    await paymentService.getById(req.user.role, req.params.id)
        .then(function (payment) {
            if (payment) {
                console.log("Pago encontrado")
                res.json(payment);
            } else {
                console.log("Sending Status")
                res.status(404).json({ message: "Transaccion no encontrado" });
            }
        })
        .catch(function (err) {
            next(err);
        });
}

async function getAllPayments(req, res, next) {

    await paymentService.getAll(req.user.role)
        .then(function (payments) {
            res.json(payments);
        })
        .catch(function (err) {
            next(err);
        });
    
}


function validateBody(payment) {
    
}