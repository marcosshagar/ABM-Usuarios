var express = require('express');
var router = express.Router();
var paymentService = require("./PaymentService");

router.post('/pay', payments);

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

function validateBody(payment) {
    
}