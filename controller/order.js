const Order = require('../model/ordermodel');
const Payment = require('../model/paymentmodel');
const { v4: uuidv4 } = require('uuid');
// Create a new order
exports.createOrder = async (req, res) => {
    try {
        const { userId, items, payment } = req.body;

        // Log the received data
        console.log('Received data:', { userId, items, payment });

        // Validate input
        if (!userId || !items || items.length === 0) {
            console.log('Validation error:', { userId, items, payment });
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Calculate total amount
        const totalAmount = items.reduce((total, item) => {
            console.log('Processing item:', item);
            return total + item.price * item.quantity;
        }, 0);

        console.log('Total amount calculated:', totalAmount);

        // Generate a unique transaction ID if not provided
        const transactionId = payment?.transactionId || uuidv4();

        // Create a new order with the generated transaction ID
        const newOrder = new Order({
            userId,
            items,
            totalAmount,
            payment: {
                ...payment,
                transactionId,  // Automatically generated if not provided
            },
        });

        // Log the order object before saving
        console.log('New Order object:', newOrder);

        await newOrder.save();
        console.log('Order saved successfully:', newOrder);

        res.status(201).json({ message: 'Order created successfully', order: newOrder });
    } catch (err) {
        console.error('Error creating order:', err.message);
        res.status(500).send('Server error');
    }
};

// Get an order by ID
exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('userId').populate('items.productId');

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        res.status(200).json(order);
    } catch (err) {
        console.error('Error fetching order:', err.message);
        res.status(500).send('Server error');
    }
};

// Get all orders
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find(); // No ObjectId query here
        res.json(orders);
    } catch (err) {
        console.error('Error fetching orders:', err.message);
        res.status(500).send('Server error');
    }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;

        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        order.orderStatus = status;
        await order.save();

        res.status(200).json({ message: 'Order status updated successfully', order });
    } catch (err) {
        console.error('Error updating order status:', err.message);
        res.status(500).send('Server error');
    }
};

// Delete an order
exports.deleteOrder = async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        // await order.remove();
        res.status(200).json({ message: 'Order deleted successfully' });
    } catch (err) {
        console.error('Error deleting order:', err.message);
        res.status(500).send('Server error');
    }
};
