// const mongoose = require('mongoose');

// // Define the Order schema
// const OrderSchema = new mongoose.Schema({
//     userId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User',
//         required: true,
//     },
//     items: [
//         {
//             productId: {
//                 type: mongoose.Schema.Types.ObjectId,
//                 ref: 'Product',
//                 required: true,
//             },
//             quantity: {
//                 type: Number,
//                 required: true,
//             },
//             price: {
//                 type: Number,
//                 required: true,
//             },
//         },
//     ],
//     totalAmount: {
//         type: Number,
//         required: true,
//     },
//     orderStatus: {
//         type: String,
//         enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled'],
//         default: 'Processing',
//     },
//     payment: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Payment',
//         required: false, 
//     },
//     orderDate: {
//         type: Date,
//         default: Date.now,
//     },
// });

// // Adding logging to pre-save middleware to track errors
// OrderSchema.pre('save', function (next) {
//     console.log('About to save order:', this);
//     next();
// });

// // Adding logging to post-save middleware
// OrderSchema.post('save', function (doc, next) {
//     console.log('Order saved successfully:', doc);
//     next();
// });

// // Adding logging to pre-validation middleware
// OrderSchema.pre('validate', function (next) {
//     console.log('Validating order:', this);
//     next();
// });

// // Adding logging to post-validation middleware
// OrderSchema.post('validate', function (doc, next) {
//     console.log('Order validation completed:', doc);
//     next();
// });

// module.exports = mongoose.model('Order', OrderSchema);
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
        {
            productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
            quantity: { type: Number, required: true },
            price: { type: Number, required: true }
        }
    ],
    totalAmount: { type: Number, required: true },
    payment: {
        method: { type: String, required: true },
        transactionId: { type: String, required: true },
        amount: { type: Number, required: true },
        status: { type: String, required: true }
    }
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
