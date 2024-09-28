const jwt = require('jsonwebtoken');
require('dotenv').config();

const ACCESS_TOKEN_SECRET_KEY = process.env.JWT_SECRET;

// Middleware to generate an access token
exports.generateAccessToken = async (user) => {
    const accessToken = jwt.sign(user, ACCESS_TOKEN_SECRET_KEY, { expiresIn: '1h' });
    return accessToken;
};

// Middleware to verify an access token
exports.verifyAccessToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.status(401).json({ error: 'Token not provided' });

        const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET_KEY);
        req.user = decoded;
        next();
    } catch (error) {
        console.error(error);
        res.status(401).json({ error: 'Invalid token' });
    }
};

