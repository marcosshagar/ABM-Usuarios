var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var paymentSchema = new Schema({

    userId: { type: String, unique: true, required: true },
    transaction_id: { type: Number, unique: true, required: true },
    transaction_amount: { type: Number, required: true },
    installments: { type: Number, required: true },
    payment_method_id: { type: String, required: true },
    payment_type_id: { type: String, required: true },
    status: { type: String, required: true },
    status_detail: { type: String, required: true },
    createDate: { type: Date, default: Date.now }
});

paymentSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Payment', paymentSchema);