const mongoose = require('mongoose');
const Joi = require('joi');

// Cart Schema for Mongoose
const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, 'User reference is required'],
  },
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: [true, 'Product reference is required'],
  }],
  totalPrices: {
    type: Number,
    required: [true, 'Total price is required'],
    min: [0, 'Total price must be a positive number'],
  },
}, { timestamps: true });

// Create the Mongoose model
const cartModel = mongoose.model("Cart", cartSchema);

// Joi validation schema for incoming request data
const validateCart = (data) => {
  const schema = Joi.object({
    user: Joi.string().custom((value, helpers) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.error('any.invalid');
      }
      return value;
    }).required(),  // Validate that it's a valid ObjectId

    products: Joi.array().items(
      Joi.string().custom((value, helpers) => {
        if (!mongoose.Types.ObjectId.isValid(value)) {
          return helpers.error('any.invalid');
        }
        return value;
      }).required()  // Each product ID must be a valid ObjectId
    ).min(1).required(),  // Ensure it's an array with at least one product

    totalPrices: Joi.number().min(0).required(),
  });

  return schema.validate(data);
};

// Export both the Joi validation function and the Mongoose model
module.exports = {
  cartModel,
  validateCart,
};
