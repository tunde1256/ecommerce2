const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
    paymentMethod: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    transactionId: {
        type: String,
        required: true,
    },
    paymentStatus: {
        type: String,
        required: true,
    },
}, { timestamps: true });

const Payment = mongoose.model('Payment', PaymentSchema);

module.exports = Payment;
