var config  = require('config.json');
var db      = require('helpers/db');
var Payment = db.Payment;
var request = require('superagent');

module.exports = {
    create,
    getAll,
    getById
};

//------ FUNCION GET ALL ----------------
async function getAll(userRole) {
    console.log(userRole);
    if (userRole === "Admin") {
        // Busca todos los datos menos hash
        return await Payment.find();
    } else {
        throw "No tiene permisos de Administrador";
    }
}

//------ FUNCION GET ByID ----------------
async function getById(userRole, userId, id) {
    let payment = await User.findById(id).select('-hash');

    if(payment._id !== userId && userRole !== "Admin") {
        throw "No tiene permisos de Administrador";
    }

    return payment;
}

//------ FUNCION CREATE ----------------
async function create(paymentDto) {

    var mpRequest = {
        transaction_amount: paymentDto.amount,
        payment_method_id: paymentDto.mpPaymentMethodId,
        token: paymentDto.mpCardToken,
        installments: 1,
        payer: {
            email: "lala@asda.com",
            identification: {
                type: "DNI",
                number: paymentDto.dni
            }
        }
    };

    var paymentModel = new Payment();

    try {
        
        console.log("envio a mercado pago");
        var mpResonse = await request.post(config.paymentRequest).send(mpRequest).set('Content-Type', 'application/json');

        console.log("Mercado pago Response", mpResonse);

        saveMpResponse = {
            transaction_amount: mpResonse.transaction_amount,
            transaction_id: mpResonse.id,
            payment_method_id: mpResonse.payment_method_id,
            payment_type_id: mpResonse.payment_type_id,
            status: mpResonse.status,
            status_detail: mpResonse.status_detail,
            installments: mpResonse.installments
        }

        console.log("Modelo de pago a guardar en base de datos", saveMpResponse);
        
        Object.assign(paymentModel, saveMpResponse);
        //paymentModel = saveMpResponse;

    } catch (err) {
        console.log("CATCH ERROR PAYMENTE SERVICE", err);
        throw err;
    }

    var model = await paymentModel.save();

   /* if (model.status=="error") {

        var err = {
            error_type: "payment",
            status_code: 422
        };

        throw err;
    }*/

    return model;
}