const Product = require('../model/productmodel');
const cloudinary = require('../middleware/cloudinary').v2;
require('dotenv').config(); // Ensure this is called to load environment variables

// Cloudinary configuration
// cloudinary.config({
//     cloud_name: process.env.cloud_name,
//     api_key: process.env.api_key,
//     api_secret: process.env.api_secret,
// });

// Create a new product
exports.createProduct = async (req, res) => {
    try {
        const { name, description, price, category, brand, stock } = req.body;
        const imageFile = req.file;

        let imageUrl = '';

        // Handle image upload if provided
        if (imageFile) {
            try {
                // Upload image to Cloudinary using buffer
                const result = await new Promise((resolve, reject) => {
                    cloudinary.uploader.upload_stream({ 
                        folder: 'products' // Optional: specify a folder in Cloudinary
                    }, (error, result) => {
                        if (error) {
                            reject(new Error('Image upload failed'));
                        }
                        resolve(result);
                    }).end(imageFile.buffer);
                });

                imageUrl = result.secure_url;
            } catch (err) {
                return res.status(500).json({ error: 'Failed to upload image to Cloudinary' });
            }
        }

        // Create a new product with the uploaded image URL (if provided)
        const product = new Product({
            name,
            description,
            price,
            category,
            brand,
            stock,
            imageUrl // Set the Cloudinary URL here
        });

        await product.save();

        return res.status(201).json({ message: 'Product created successfully', product });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
    }
};

// Get a single product by ID
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        return res.json(product);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
    }
};

// Get all products
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        return res.json(products);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
    }
};

// Update a product by ID
exports.updateProduct = async (req, res) => {
    try {
        const { name, description, price, category, brand, stock } = req.body;
        const imageFile = req.file;

        const updateData = { name, description, price, category, brand, stock };

        if (imageFile) {
            // Upload new image to Cloudinary
            const result = await cloudinary.uploader.upload(imageFile.path);
            updateData.imageUrl = result.secure_url;
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            { ...updateData, updatedAt: Date.now() },
            { new: true, runValidators: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }
        return res.json({ message: 'Product updated successfully', updatedProduct });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
    }
};

// Delete a product by ID
exports.deleteProduct = async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }
        return res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
    }
};

exports