const mongoose = require('mongoose');
const Joi = require('joi');

// Admin Schema for Mongoose
const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Admin name is required'],
    minlength: [3, 'Name must be at least 3 characters long'],
    maxlength: [50, 'Name cannot exceed 50 characters'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,  // Ensures no duplicate emails
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],  // Email format validation
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long'],
  },
  role: {
    type: String,
    enum: ['Admin', 'SuperAdmin'],  // Only allow certain roles
    default: 'Admin',
    required: [true, 'Role is required'],
  },
}, { timestamps: true });

// Create the Mongoose model
const adminModel = mongoose.model("Admin", adminSchema);

// Joi validation schema for incoming request data
const validateAdmin = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('Admin', 'SuperAdmin').required(),
  });

  return schema.validate(data);
};

// Export both the Joi validation function and the Mongoose model
module.exports = {
  adminModel,
  validateAdmin,
};
