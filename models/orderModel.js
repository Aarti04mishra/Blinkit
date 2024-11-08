const mongoose = require('mongoose');
const Joi = require('joi');

// Order Schema for Mongoose
const orderSchema = new mongoose.Schema({
  orderId:{
    type:String,
    required:true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: [true, 'User reference is required'],
  },
  products: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "product",
    required: [true, 'Product reference is required'],
  },
  totalPrices: {
    type: Number,
    required: [true, 'Total price is required'],
    min: [0, 'Total price must be a positive number'],
  },
  status: {
    type: String,
    required: [true, 'Order status is required'],
    enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'], // Limiting to predefined statuses
  },
  payment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "payment",
    required: [true, 'Payment reference is required'],
  },
  delivery: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "delivery",
    required: [true, 'Delivery reference is required'],
  },
}, { timestamps: true });

// Create the Mongoose model
const Order = mongoose.model("Order", orderSchema);

// Joi validation schema for incoming request data
const validateOrder = (data) => {
  const schema = Joi.object({
    user: Joi.string().required(), // Should be a valid ObjectId
    products: Joi.string().required(), // Should be a valid ObjectId
    totalPrices: Joi.number().min(0).required(),
    address: Joi.string().min(10).required(),
    status: Joi.string().valid('Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled').required(),
    payment: Joi.string().required(), // Should be a valid ObjectId
    delivery: Joi.string().required(), // Should be a valid ObjectId
  });

  return schema.validate(data);
};

// Export both the Joi validation function and the Mongoose model
module.exports = {
  Order,
  validateOrder,
};
