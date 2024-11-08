const mongoose = require('mongoose');
const Joi = require('joi');

// Category Schema for Mongoose
const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Category name is required'],
  
  },
}, { timestamps: true });

// Create the Mongoose model
const categoryModel = mongoose.model("Category", categorySchema);

// Joi validation schema for incoming request data
const validateCategory = (data) => {
  const schema = Joi.object({
    name: Joi.string().required(),  // Name must be between 3-50 characters
  });

  return schema.validate(data);
};

// Export both the Joi validation function and the Mongoose model
module.exports = {
  categoryModel,
  validateCategory,
};
