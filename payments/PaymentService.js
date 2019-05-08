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
            transaction_amount: mpResonse.body.transaction_amount,
            transaction_id: mpResonse.body.id,
            payment_method_id: mpResonse.body.payment_method_id,
            payment_type_id: mpResonse.body.payment_type_id,
            status: mpResonse.body.status,
            status_detail: mpResonse.body.status_detail,
            installments: mpResonse.body.installments
        }

        console.log("Modelo de pago a guardar en base de datos", saveMpResponse);
        
        Object.assign(paymentModel, saveMpResponse);

        await paymentModel.save();

    } catch (err) {
    
        errorModel = {
            name: err.message,
            status_code: err.status,
            message: err.response.body.message
        };

        console.log("Modelo de error", errorModel);
        Object.assign(err, errorModel);

        throw err;
    }

    return model;
}