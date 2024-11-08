const mongoose = require('mongoose');
const Joi = require('joi');

// Delivery Schema for Mongoose
const deliverySchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "order",
    required: [true, 'Order reference is required'],
  },
  deliveryBoy: {
    type: String,
    required: [true, 'Delivery person name is required'],
    minlength: [3, 'Delivery person name must be at least 3 characters long'],
  },
  status: {
    type: String,
    required: [true, 'Delivery status is required'],
    enum: ['Pending', 'In Progress', 'Completed', 'Failed'],  // Limiting the allowed statuses
  },
  trackingURL: {
    type: String,
    required: [true, 'Tracking URL is required'],
    match: [/^(ftp|http|https):\/\/[^ "]+$/, 'Please provide a valid URL'], // Ensure it's a valid URL
  },
  estimatedDeliveryTime: {
    type: Number,
    required: [true, 'Estimated delivery time is required'],
    min: [0, 'Estimated delivery time must be a positive number'],
  },
}, { timestamps: true });

// Create the Mongoose model
const Delivery = mongoose.model("Delivery", deliverySchema);

// Joi validation schema for incoming request data
const validateDelivery = (data) => {
  const schema = Joi.object({
    order: Joi.string().required(),  // Should be a valid ObjectId
    deliveryBoy: Joi.string().min(3).required(),
    status: Joi.string().valid('Pending', 'In Progress', 'Completed', 'Failed').required(),
    trackingURL: Joi.string().uri().required(),  // Joi's .uri() ensures it's a valid URL
    estimatedDeliveryTime: Joi.number().min(0).required(),
  });

  return schema.validate(data);
};

// Export both the Joi validation function and the Mongoose model
module.exports = {
  Delivery,
  validateDelivery,
};
