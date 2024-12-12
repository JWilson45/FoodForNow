// src/routes/pantry/validator.js

const Joi = require('joi');
const mongoose = require('mongoose');

// Validator for MongoDB ObjectId
const objectIdValidator = (value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.message('Invalid ingredient ID.');
  }
  return value;
};

// Validation schema for adding an ingredient to the pantry
const addPantryIngredientValidationSchema = Joi.object({
  ingredientId: Joi.string().required().custom(objectIdValidator).messages({
    'any.required': 'Ingredient ID is required.',
  }),
  quantity: Joi.number().integer().min(1).required().messages({
    'any.required': 'Quantity is required.',
    'number.base': 'Quantity must be a number.',
    'number.min': 'Quantity must be at least 1.',
  }),
});

// Validation schema for updating a pantry ingredient
const updatePantryIngredientValidationSchema = Joi.object({
  quantity: Joi.number().integer().min(1).required().messages({
    'any.required': 'Quantity is required.',
    'number.base': 'Quantity must be a number.',
    'number.min': 'Quantity must be at least 1.',
  }),
});

// Validation schema for getting or deleting a pantry ingredient by ID
const getPantryIngredientValidationSchema = Joi.object({
  id: Joi.string().required().custom(objectIdValidator).messages({
    'any.required': 'Pantry ingredient ID is required.',
  }),
});

module.exports = {
  addPantryIngredientValidationSchema,
  updatePantryIngredientValidationSchema, // Ensure this is defined and exported
  getPantryIngredientValidationSchema,
};