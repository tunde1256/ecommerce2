const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const jwt = require('jsonwebtoken'); // JWT for token verification
const userRouter = require('./router/userrouter');
const productRouter = require('./router/products.js');
const orderRouter = require('./router/orderRouter');
const paymentRouter = require('./router/paymentRouter');
const { verifyAccessToken } = require('./controller/generateToken'); // JWT verification middleware

dotenv.config();
const port = process.env.PORT || 4045;
const app = express();
const db = require('./db/db');
// Middleware for serving static files (if you have uploads)
app.use('/uploads', express.static('uploads'));

// Logging middleware
app.use(morgan('dev'));

// Body parsers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB connection


// Swagger setup
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'E-Commerce API',
            version: '1.0.0',
            description: 'API for an E-Commerce application built with Node.js and MongoDB',
            contact: {
                name: 'Developer',
                email: 'developer@example.com'
            },
        },
        servers: [
            {
                url: `http://localhost:${port}`,
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [{
            bearerAuth: []
        }],
    },
    apis: ['./router/*.js'], // Path to the API documentation
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Middleware to verify JWT
app.use((req, res, next) => {
    if (req.path.startsWith('/api') && !req.path.startsWith('/api/user')) {
        verifyAccessToken(req, res, next); // Protect all API routes except user registration/login
    } else {
        next();
    }
});

// Routes
app.use('/api/user', userRouter);
app.use('/api/products', productRouter);
app.use('/api/', orderRouter);
app.use('/api/payments', paymentRouter);

app.get('/', (req, res) => {
    res.send('Hello, welcome to the E-Commerce API');
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
