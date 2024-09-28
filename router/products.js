const express = require('express');
const multer = require('multer');
const Product = require('../model/productmodel');
const productController = require('../controller/product');
const { verifyAccessToken } = require('../controller/generateToken'); // Destructure properly

const router = express.Router();

// Set up multer for file uploads
const storage = multer.memoryStorage(); // Store files in memory as buffer
const upload = multer({ storage: storage });

// Create Product Route - Protected
router.post('/', verifyAccessToken, upload.single('imageUrl'), productController.createProduct);

// Get All Products Route - Protected
router.get('/', verifyAccessToken, productController.getAllProducts);

// Get Product by ID Route - Protected
router.get('/:id', verifyAccessToken, productController.getProductById);

// Delete Product Route - Protected
router.delete('/:id', verifyAccessToken, productController.deleteProduct);

// Route to update a product with an optional image upload - Protected
router.put('/:id', verifyAccessToken, upload.single('imageUrl'), productController.updateProduct);

// Protected route example
router.post('/some-protected-route', verifyAccessToken, (req, res) => {
    res.send('This is a protected route');
});

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management and operations
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
 *     Product:
 *       type: object
 *       required:
 *         - name
 *         - price
 *       properties:
 *         id:
 *           type: string
 *           description: Auto-generated ID of the product
 *         name:
 *           type: string
 *           description: Name of the product
 *         price:
 *           type: number
 *           description: Price of the product
 *         imageUrl:
 *           type: string
 *           description: URL of the product image
 */

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the product
 *               price:
 *                 type: number
 *                 description: Price of the product
 *               imageUrl:
 *                 type: string
 *                 format: binary
 *                 description: Image of the product
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized - JWT token is required
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Retrieve all products
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       401:
 *         description: Unauthorized - JWT token is required
 */

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Retrieve a specific product by ID
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the product
 *     responses:
 *       200:
 *         description: Product retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 *       401:
 *         description: Unauthorized - JWT token is required
 */

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete a product by ID
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the product to delete
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
 *       401:
 *         description: Unauthorized - JWT token is required
 */

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Update a product by ID
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the product
 *               price:
 *                 type: number
 *                 description: Price of the product
 *               imageUrl:
 *                 type: string
 *                 format: binary
 *                 description: Image of the product
 *     responses:
 *       200:
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Invalid input data
 *       404:
 *         description: Product not found
 *       401:
 *         description: Unauthorized - JWT token is required
 */

module.exports = router;

