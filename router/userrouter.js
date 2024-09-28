const express = require('express');
const router = express.Router();
const userController = require('../controller/userreg');
const { verifyAccessToken } = require('../controller/generateToken');

/**
 * @swagger
 * tags:
 *   name: User
 *   description: User management and authentication
 */

/**
 * @swagger
 * /api/user/register:
 *   post:
 *     summary: Register a new user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstname
 *               - lastname
 *               - username
 *               - password
 *               - email
 *             properties:
 *               firstname:
 *                 type: string
 *                 description: The first name of the new user
 *               lastname:
 *                 type: string
 *                 description: The last name of the new user
 *               username:
 *                 type: string
 *                 description: The username of the new user
 *               password:
 *                 type: string
 *                 description: The user's password
 *               email:
 *                 type: string
 *                 description: The user's email
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Invalid input
 */
router.post('/register', userController.register);

/**
 * @swagger
 * /api/user/login:
 *   post:
 *     summary: Login a user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email of the user
 *               password:
 *                 type: string
 *                 description: The user's password
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', userController.login);

/**
 * @swagger
 * /api/user/some-protected-route:
 *   post:
 *     summary: Access a protected route
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully accessed the protected route
 *       401:
 *         description: Unauthorized - Token required
 */
router.post('/some-protected-route', verifyAccessToken, (req, res) => {
    res.send('This is a protected route');
});

/**
 * @swagger
 * tags:
 *   name: User
 *   description: User management and authentication
 */

/**
 * @swagger
 * /api/user/{id}/favorite-products:
 *   get:
 *     summary: Add a product to the user's favorite products
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product added to favorites successfully
 *       404:
 *         description: User not found
 */
router.get('/:id', verifyAccessToken, userController.addFavoriteProduct);

/**
 * @swagger
 * /api/user/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 */
router.delete('/:id', verifyAccessToken, userController.deleteUser);

/**
 * @swagger
 * /api/user/{id}/profile:
 *   get:
 *     summary: Get the user's profile by ID
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *       404:
 *         description: User not found
 */
router.get('/:id', verifyAccessToken, userController.getUserProfile);

/**
 * @swagger
 * /api/user/{id}/profile:
 *   put:
 *     summary: Update the user's profile by ID
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstname:
 *                 type: string
 *                 description: The first name of the user
 *               lastname:
 *                 type: string
 *                 description: The last name of the user
 *               email:
 *                 type: string
 *                 description: The user's email
 *     responses:
 *       200:
 *         description: User profile updated successfully
 *       404:
 *         description: User not found
 */
router.put('/:id', verifyAccessToken, userController.updateUserProfile);

/**
 * @swagger
 * /api/user:
 *   get:
 *     summary: Get all users
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 */
router.get('/', verifyAccessToken, userController.getAllUsers);

/**
 * @swagger
 * /api/user/favorite-products:
 *   get:
 *     summary: Get all favorite products of the user
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Favorite products retrieved successfully
 */
router.get('/', verifyAccessToken, userController.getFavoriteProducts);

/**
 * @swagger
 * /api/user/orders:
 *   get:
 *     summary: Get all orders of the user
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User orders retrieved successfully
 */
router.get('/', verifyAccessToken, userController.getUserOrders);

/**
 * @swagger
 * /api/user/order-history:
 *   get:
 *     summary: Get the order history of the user
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User order history retrieved successfully
 */
router.get('/', verifyAccessToken, userController.getOrderHistory);

/**
 * @swagger
 * /api/user/logout:
 *   post:
 *     summary: Logout the user
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User logged out successfully
 */
router.post('/logout', verifyAccessToken, userController.logout);

/**
 * @swagger
 * /api/user/forgot-password:
 *   post:
 *     summary: Request a password reset
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The user's email
 *     responses:
 *       200:
 *         description: Password reset email sent
 */
router.post('/forgot-password', verifyAccessToken, userController.forgotPassword);

/**
 * @swagger
 * /api/user/reset-password/{token}:
 *   post:
 *     summary: Reset the user's password
 *     tags: [User]
 *     parameters:
 *       - name: token
 *         in: path
 *         required: true
 *         description: The password reset token
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *                 description: The new password
 *                 example: "newPassword123"
 *             required:
 *               - password
 *     responses:
 *       200:
 *         description: Password reset successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Password reset successful"
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Token is required"  # Or "Password is required" depending on the specific error
 *       404:
 *         description: User Not Found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "User not found"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid or expired token"
 */
router.post('/reset-password/:token', verifyAccessToken, userController.resetPassword);

/**
 * @swagger
 * /api/user/change-password:
 *   post:
 *     summary: Change the user's password
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 description: The current password
 *               newPassword:
 *                 type: string
 *                 description: The new password
 *     responses:
 *       200:
 *         description: Password changed successfully
 */
router.post('/change-password', verifyAccessToken, userController.changePassword);

/**
 * @swagger
 * /api/user/order-details:
 *   get:
 *     summary: Get details of a specific order
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Order details retrieved successfully
 */
router.get('/', verifyAccessToken, userController.getOrderDetails);

module.exports = router;




module.exports = router;
