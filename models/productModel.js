const mongoose = require('mongoose');
const Joi = require('joi');

// Product Schema for Mongoose
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    minlength: [3, 'Product name must be at least 3 characters long'],
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price must be a positive number'],
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    minlength: [2, 'Category must be at least 2 characters long'],
  },
  stock: {
    type:Number,
    required: [true, 'Stock status is required'],
  },
  description: {
    type: String
  },
  image: {
    type: Buffer,
   
  },
}, { timestamps: true });

// Create the Mongoose model
const productModel = mongoose.model("Product", productSchema);

// Joi validation schema for incoming request data
const validateProduct = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    price: Joi.number().min(0).required(),
    category: Joi.string().min(2).required(),
    stock: Joi.number().required(),
    description: Joi.string().optional(),
    image: Joi.string().optional(),
  });

  return schema.validate(data);
};

// Export both the Joi validation function and the Mongoose model
module.exports = {
  productModel,
  validateProduct,
};
