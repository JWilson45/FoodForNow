// src/routes/pantry/validator.js

const Joi = require('joi');
const mongoose = require('mongoose');

// Custom validator for ObjectId fields
const objectIdValidator = (value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.message('must be a valid ObjectId');
  }
  return value;
};

// Validation schema for adding an ingredient to the pantry
const addPantryIngredientValidationSchema = Joi.object({
  name: Joi.string().required().trim().messages({
    'string.empty': 'Name is required and cannot be empty.',
    'any.required': 'Name is a required field.',
  }),
  quantity: Joi.number().integer().min(1).required().messages({
    'any.required': 'Quantity is required.',
    'number.base': 'Quantity must be a number.',
    'number.min': 'Quantity must be at least 1.',
  }),
  unit: Joi.string().optional().trim(),
});

// Validation schema for updating a pantry ingredient
const updatePantryIngredientValidationSchema = Joi.object({
  name: Joi.string().optional().trim(),
  quantity: Joi.number().integer().min(1).optional(),
  unit: Joi.string().optional().trim(),
});

// Validation schema for fetching/deleting a pantry ingredient by ID
const getPantryIngredientValidationSchema = Joi.object({
  id: Joi.string().required().custom(objectIdValidator).messages({
    'any.required': 'Pantry Ingredient ID is required.',
  }),
});

module.exports = {
  addPantryIngredientValidationSchema,
  updatePantryIngredientValidationSchema,
  getPantryIngredientValidationSchema,
};