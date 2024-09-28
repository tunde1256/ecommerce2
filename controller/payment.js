const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY); // Initialize Stripe with your secret key
const mongoose = require('mongoose'); // Import mongoose

const Payment = require('../model/paymentmodel');
const Order = require('../model/ordermodel');

// Create a new payment and link it to an order


exports.createPayment = async (req, res) => {
    const { paymentMethodId, amount, orderId } = req.body;

    if (!paymentMethodId || !amount || !orderId) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
        return res.status(400).json({ error: 'Invalid order ID' });
    }

    try {
        console.log('Creating PaymentIntent for amount:', amount, 'and order ID:', orderId);

        // Create a PaymentIntent with Stripe
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100, // Amount in cents
            currency: 'usd',
            payment_method: paymentMethodId,
            confirm: true,
            automatic_payment_methods: {
                enabled: true,
                allow_redirects: 'never'  // Prevent redirects for payment methods that require it
            }
        });

        console.log('PaymentIntent created:', paymentIntent.id);

        // Create a new payment record
        const payment = new Payment({
            paymentMethod: paymentMethodId,
            amount,
            transactionId: paymentIntent.id,
            paymentStatus: paymentIntent.status,
        });

        // Save the payment to the database
        const savedPayment = await payment.save();
        console.log('Payment saved:', savedPayment);

        // Find the order and link the payment to it
        const orderWithPayment = await Order.findById(orderId);

        if (!orderWithPayment) {
            // Order not found, delete the created payment record and return an error response
            console.error('Order not found');
            await Payment.findByIdAndDelete(savedPayment._id); // Ensure to remove the payment if order is not found
            return res.status(404).json({ error: 'Order not found' });
        }

        // Link the payment to the order
        orderWithPayment.payment = {
            method: payment.paymentMethod,
            transactionId: payment.transactionId,
            amount: payment.amount,
            status: payment.paymentStatus,
        };

        console.log('Final Order object before saving:', orderWithPayment);

        // Save the updated order
        await orderWithPayment.save();

        res.status(201).json({ message: 'Payment processed successfully', paymentId: savedPayment._id });
    } catch (err) {
        console.error('Error processing payment:', err.message);
        res.status(500).send('Server error');
    }
};
// Get payment details by ID
exports.getPaymentById = async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.id);
        if (!payment) {
            return res.status(404).json({ error: 'Payment not found' });
        }
        res.json(payment);
    } catch (err) {
        console.error('Error fetching payment details:', err.message);
        res.status(500).send('Server error');
    }
};
exports.getAllPayment = async function (req, res) {
    try {
        const payments = await Payment.find();
        res.json(payments);
    } catch (err) {
        console.error('Error fetching payments:', err.message);
        res.status(500).send('Server error');
    }

}