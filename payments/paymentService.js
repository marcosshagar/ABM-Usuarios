var request = require('superagent');

module.exports = payments;

async function payments(payParams){

    console.log("ingreso a la funcion de pagar");
  //  var paymentData = {
    //   url: "https://api.mercadopago.com/v1/payments?access_token=TEST-7094732018586761-042619-0460da5877116609ef45498be16d8e41-221281264",
       //form: payParams
   // }
    console.log(payParams);

    request.post("https://api.mercadopago.com/v1/payments?access_token=TEST-7094732018586761-042619-0460da5877116609ef45498be16d8e41-221281264")
        .send(payParams)
        //.set('access_token', 'TEST-7094732018586761-042619-0460da5877116609ef45498be16d8e41-221281264')
        .set('Content-Type', 'application/json')
        .end(function(err, res){
            if (!err){
                console.log(res.body);
            } else {
                console.log(err);
            }
        })
};
