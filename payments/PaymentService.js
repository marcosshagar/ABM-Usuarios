//Marcos Shanahan

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
        return await Payment.find();
    } else {
        throw "No tiene permisos de Administrador";
    }
}

//------ FUNCION GET ByID ----------------
async function getById(userRole, userId, transaction_id) {

    let payment = await Payment.findOne({ transaction_id: transaction_id}).select('-__v');

    if (userRole !== "Admin" || (payment && userId !== payment.userId)) {

        errorModel = {
            name: "Forbidden",
            message: "No estas autorizado para ver esta transaccion"
        };

        throw errorModel;
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

        transactionData = {
            userId: paymentDto.userId,
            transaction_amount: mpResonse.body.transaction_amount,
            transaction_id: mpResonse.body.id,
            payment_method_id: mpResonse.body.payment_method_id,
            payment_type_id: mpResonse.body.payment_type_id,
            status: mpResonse.body.status,
            status_detail: mpResonse.body.status_detail,
            installments: mpResonse.body.installments
        }

        console.log("Modelo de pago a guardar en base de datos", transactionData);
        
        Object.assign(paymentModel, transactionData);
        console.log("Asigno los datos del response a mi objeto");
        
        console.log("Comienzo a guardar la Transaccion");
        

    } catch (err) {
        console.log(err);

        if (err.code === "ENOTFOUND") {

            err.message = "No se realizo la conexion a api.mercadopago.com";

        } else {

            errorModel = {
                name: err.message,
                status_code: err.status,
                message: err.response.body.message
            };

            console.log("Modelo de error", errorModel);
            Object.assign(err, errorModel);
        }

        throw err;
    }

    await savePayment(paymentModel);

    return paymentModel;
    
}

async function savePayment(payment) {

    try {

        await payment.save();
        console.log("se Guardo la Transacion en la base de datos");

    } catch (error) {
        console.log("Comienzo a devolver la plata");
        var refund = await request.post(config.refundRequest.replace(":id", payment.transaction_id)).set('Content-Type', 'application/json');
        console.log("Devuelvo la plata", refund);
 
        console.log("ERROR EN GUARDAR EL PAGO", error);
        throw error;
    }
}
