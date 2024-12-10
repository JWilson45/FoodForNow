const Joi = require('joi');
const mongoose = require('mongoose');

// Custom validator for ObjectId fields
const objectIdValidator = (value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.message('must be a valid ObjectId');
  }
  return value;
};

// Validation schema for creating an ingredient
const createIngredientValidationSchema = Joi.object({
  name: Joi.string().required().trim().messages({
    'string.empty': 'Name is required and cannot be empty.',
    'any.required': 'Name is a required field.',
  }),
  description: Joi.string().optional().trim(),
  calories: Joi.number().optional(),
  image: Joi.binary().optional(), // Consider using Joi.string().uri() if storing image URLs
  nutritionalInfo: Joi.object({
    fat: Joi.number().optional(),
    protein: Joi.number().optional(),
    carbohydrates: Joi.number().optional(),
    fiber: Joi.number().optional(),
  }).optional(),
});

// Validation schema for updating an ingredient
const updateIngredientValidationSchema = Joi.object({
  name: Joi.string().optional().trim(),
  description: Joi.string().optional().trim(),
  calories: Joi.number().optional(),
  image: Joi.binary().optional(), // Consider using Joi.string().uri() if storing image URLs
  nutritionalInfo: Joi.object({
    fat: Joi.number().optional(),
    protein: Joi.number().optional(),
    carbohydrates: Joi.number().optional(),
    fiber: Joi.number().optional(),
  }).optional(),
});

// Validation schema for fetching/deleting an ingredient by ID
const getIngredientValidationSchema = Joi.object({
  id: Joi.string().required().custom(objectIdValidator).messages({
    'any.required': 'Ingredient ID is required.',
  }),
});

module.exports = {
  createIngredientValidationSchema,
  updateIngredientValidationSchema,
  getIngredientValidationSchema,
};
