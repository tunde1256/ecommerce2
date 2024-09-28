const mongoose = require('mongoose');


// Define the User schema
const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: false,
    trim: true,
  },
  lastName: {
    type: String,
    required: false,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: function(value) {
        // Regular expression for validating email format
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      },
      message: 'Invalid email address',
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 6, // Minimum length for password
  },
  address: {
    street: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },
    state: {
      type: String,
      trim: true,
    },
    postalCode: {
      type: String,
      trim: true,
    },
    country: {
      type: String,
      trim: true,
    },
  },
  phoneNumber: {
    type: String,
    trim: true,
    validate: {
      validator: function(value) {
        // Simple phone number validation
        return /^\d{10}$/.test(value);
      },
      message: 'Invalid phone number',
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Middleware to update `updatedAt` on save
UserSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Create and export the model
module.exports  = mongoose.model('User', UserSchema);

