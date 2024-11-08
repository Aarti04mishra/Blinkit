const mongoose = require('mongoose');
const Joi = require('joi');

// Address Schema for Mongoose
const addressSchema = new mongoose.Schema({
  state: {
    type: String,
    required: [true, 'State is required'],
    minlength: [2, 'State must be at least 2 characters long'],
  },
  zip: {
    type: Number,
    required: [true, 'ZIP code is required'],
    minlength: [5, 'ZIP code must be at least 5 digits long'],
  },
  city: {
    type: String,
    required: [true, 'City is required'],
    minlength: [2, 'City must be at least 2 characters long'],
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    minlength: [5, 'Address must be at least 5 characters long'],
  },
});

// User Schema for Mongoose
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    minlength: [3, 'Name must be at least 3 characters long'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
  },
  password: {
    type: String,
    minlength: [6, 'Password must be at least 6 characters long'],
  },
  phone: {
    type: Number,
    minlength: [10, 'Phone number must be at least 10 digits long'],
  },
  addresses: [addressSchema],
}, { timestamps: true });

// Create the Mongoose model
const userModel = mongoose.model("User", userSchema);

// Joi validation schema for incoming request data
const validateUser = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6),
    phone: Joi.number().min(1000000000), // At least 10 digits
    addresses: Joi.array().items(
      Joi.object({
        state: Joi.string().min(2).required(),
        zip: Joi.number().min(10000).required(), // At least 5 digits
        city: Joi.string().min(2).required(),
        address: Joi.string().min(5).required(),
      })
    ),
  });

  return schema.validate(data);
};

// Export both the Joi validation function and the Mongoose model
module.exports = {
  userModel,
  validateUser,
};
