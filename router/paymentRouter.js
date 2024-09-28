// routes/paymentRouter.js
const express = require('express');
const paymentController = require('../controller/payment');
const { verifyAccessToken } = require('../controller/generateToken'); // Destructure properly

const router = express.Router();

// Route to create a new payment
router.post('/', verifyAccessToken,paymentController.createPayment);

// Route to get payment details by ID
router.get('/:id', verifyAccessToken,paymentController.getPaymentById);
router.get('/',verifyAccessToken, paymentController.getAllPayment);
/**
/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: Payment management and processing
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
 *     PaymentRequest:
 *       type: object
 *       required:
 *         - paymentMethodId
 *         - amount
 *         - orderId
 *       properties:
 *         paymentMethodId:
 *           type: string
 *           description: Stripe payment method ID
 *         amount:
 *           type: number
 *           description: Amount to be charged in USD
 *         orderId:
 *           type: string
 *           description: ID of the order to which the payment relates
 *     PaymentResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Success message
 *         paymentId:
 *           type: string
 *           description: ID of the processed payment
 */

/**
 * @swagger
 * /api/payments:
 *   post:
 *     summary: Process a payment for an order
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PaymentRequest'
 *     responses:
 *       201:
 *         description: Payment processed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaymentResponse'
 *       400:
 *         description: Invalid input data or invalid order ID
 *       401:
 *         description: Unauthorized - JWT token is required
 *       404:
 *         description: Order not found
 *       500:
 *         description: Server error
 */
/**
 * @swagger
 * /api/payments/{id}:
 *   get:
 *     summary: Get payment details by ID
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the payment to retrieve
 *     responses:
 *       200:
 *         description: Payment retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Payment'
 *       404:
 *         description: Payment not found
 *       401:
 *         description: Unauthorized - JWT token is required
 */

/**
 * @swagger
 * /api/payments:
 *   get:
 *     summary: Retrieve all payments
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of payments retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Payment'
 *       401:
 *         description: Unauthorized - JWT token is required
 */

module.exports = router;
