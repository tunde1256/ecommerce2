const express = require('express');
const  router = express.Router();
const orderController = require('../controller/order');
const { verifyAccessToken } = require('../controller/generateToken'); // Destructure properly


// Create a new order
router.post('/orders', verifyAccessToken,orderController.createOrder);

// Retrieve all orders
router.get('/orders', verifyAccessToken,orderController.getAllOrders);

// Retrieve a specific order by ID
router.get('/orders/:id',verifyAccessToken, orderController.getOrderById);

// Delete an order by ID
router.delete('/orders/:id',verifyAccessToken, orderController.deleteOrder);

// Update the status of an order
router.put('/orders/status',verifyAccessToken, orderController.updateOrderStatus);

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order management and operations
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     OrderItem:
 *       type: object
 *       required:
 *         - productId
 *         - quantity
 *         - price
 *       properties:
 *         productId:
 *           type: string
 *           description: ID of the product
 *         quantity:
 *           type: number
 *           description: Quantity of the product ordered
 *         price:
 *           type: number
 *           description: Price of the product
 *     Payment:
 *       type: object
 *       required:
 *         - method
 *         - transactionId
 *         - amount
 *         - status
 *       properties:
 *         method:
 *           type: string
 *           description: Payment method (e.g., credit_card, PayPal)
 *         transactionId:
 *           type: string
 *           description: Transaction ID for the payment
 *         amount:
 *           type: number
 *           description: Payment amount
 *         status:
 *           type: string
 *           description: Status of the payment (e.g., Pending, Completed)
 *     Order:
 *       type: object
 *       required:
 *         - userId
 *         - items
 *         - payment
 *       properties:
 *         userId:
 *           type: string
 *           description: ID of the user placing the order
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/OrderItem'
 *           description: Array of items in the order
 *         payment:
 *           $ref: '#/components/schemas/Payment'
 *           description: Payment information
 */

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Order'
 *     responses:
 *       201:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Order created successfully"
 *                 order:
 *                   $ref: '#/components/schemas/Order'
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized - JWT token is required
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Retrieve all orders
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of orders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       401:
 *         description: Unauthorized - JWT token is required
 */

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Retrieve a specific order by ID
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the order
 *     responses:
 *       200:
 *         description: Order retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       404:
 *         description: Order not found
 *       401:
 *         description: Unauthorized - JWT token is required
 */

/**
 * @swagger
 * /api/orders/{id}:
 *   delete:
 *     summary: Delete an order by ID
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the order to delete
 *     responses:
 *       200:
 *         description: Order deleted successfully
 *       404:
 *         description: Order not found
 *       401:
 *         description: Unauthorized - JWT token is required
 */

/**
 * @swagger
 * /api/orders/status:
 *   put:
 *     summary: Update the status of an order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - status
 *             properties:
 *               id:
 *                 type: string
 *                 description: ID of the order to update
 *               status:
 *                 type: string
 *                 description: New status of the order (e.g., pending, shipped, delivered)
 *     responses:
 *       200:
 *         description: Order status updated successfully
 *       400:
 *         description: Invalid input data
 *       404:
 *         description: Order not found
 *       401:
 *         description: Unauthorized - JWT token is required
 */




module.exports = router;