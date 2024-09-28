const User = require('../model/auth');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config();

    

// Send email verification link
exports.sendVerificationEmail = async (email, token) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: 'Verify your email address',
        text: `To verify your email, please click the following link:\n\nhttp://localhost:3000/verify/${token}`,
    };

    await transporter.sendMail(mailOptions);
};


// Register new user
exports.register = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        // Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ error: 'Email already exists' });

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user
        const user = new User({ firstName, lastName, email, password: hashedPassword });
        await user.save();

        // Generate and send JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.json({ message:"regisration successful",token});
        console.log(token);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};
exports.login = async (req, res) => {
    const  {email, password} = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: 'Incorrect password' });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    
        console.log(token);
         res.status(200).json({message:"user login successful", token: token});

    }catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};


// Get user profile
exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Update user profile


exports.updateUserProfile = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.user.id, req.body, { new: true, runValidators: true });
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
}



// Logout user
exports.logout = (req, res) => {
    res.json({ message: 'User logged out' });
};

// Forgot password

 // For sending emails

exports.forgotPassword = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(404).json({ error: 'User not found' });

        // Generate a random token and set it in the user document
        const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '10m' });
        user.resetToken = resetToken;
        await user.save();

        // Create password reset URL
        const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
        
        // Email data for sending the password reset email
        const emailData = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'Password Reset',
            html: `<p>You are receiving this email because you requested a password reset for your account.</p>
                   <p>Please click on the following link to reset your password:</p>
                   <a href="${resetUrl}">Reset Password</a>
                   <p>This link will expire in 10 minutes.</p>`
        };

        // Configure nodemailer
        const transporter = nodemailer.createTransport({
            service: 'Gmail', // or another email service
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        // Send the email
        await transporter.sendMail(emailData);

        return res.status(200).json({ message: 'Password reset email sent successfully' });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
    }
};


// Reset password
exports.resetPassword = async (req, res) => {
    try {
        const token = req.params.token || req.query.token || req.body.token;

        if (!token) {
            return res.status(400).json({ error: 'Token is required' });
        }

        console.log('Token from request:', token);

        const resetToken = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded Reset Token:', resetToken);

        const user = await User.findById(resetToken.id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const password = req.body.password;
        if (!password) {
            return res.status(400).json({ error: 'Password is required' });
        }

        // Hash the new password and update the user's password
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        user.resetToken = null; // Clear the reset token
        await user.save();

        return res.status(200).json({ message: 'Password reset successful' });

    } catch (error) {
        console.error('Error during password reset:', error);
        return res.status(400).json({ error: 'Invalid or expired token' });
    }
};

// Change password
exports.changePassword = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        // Check if the current password is correct
        const isMatch = await bcrypt.compare(req.body.currentPassword, user.password);
        if (!isMatch) return res.status(401).json({ error: 'Incorrect current password' });

        // Hash the new password and update the user document
        const hashedPassword = await bcrypt.hash(req.body.newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        return res.status(200).json({ message: 'Password changed successfully' });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
    }
};

// Get user's orders
exports.getUserOrders = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('orders');
        res.json(user.orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Get user's order details
exports.getOrderDetails = async (req, res) => {
    try {
        const order = await order.findById(req.params.orderId).populate('userId').populate('items.productId');

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        if (order.userId.toString() !== req.user.id) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        res.json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Get user's order history
exports.getOrderHistory = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate({
            path: 'orders',
            populate: { path: 'items.productId' }
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user.orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Get user's favorite products
exports.getFavoriteProducts = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user.favoriteProducts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Add a favorite product
exports.addFavoriteProduct = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.user.id, { $push: { favoriteProducts: req.params.productId } }, { new: true });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};


// Remove a favorite product
exports.removeFavoriteProduct = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.user.id, { $pull: { favoriteProducts: req.params.productId } }, { new: true });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
  
};
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};