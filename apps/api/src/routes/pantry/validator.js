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

// Validator for pantryName
const pantryNameValidator = Joi.string()
  .min(1)
  .max(100)
  .required()
  .messages({
    'any.required': 'Pantry name is required.',
    'string.empty': 'Pantry name cannot be empty.',
    'string.min': 'Pantry name must be at least 1 character long.',
    'string.max': 'Pantry name must not exceed 100 characters.',
  });

// Validation schema for adding an ingredient to the pantry
const addPantryIngredientValidationSchema = Joi.object({
  pantryName: pantryNameValidator, // Validate pantryName
  ingredientId: Joi.string().required().custom(objectIdValidator).messages({
    'any.required': 'Ingredient ID is required.',
  }),
  quantity: Joi.number().integer().min(1).required().messages({
    'any.required': 'Quantity is required.',
    'number.base': 'Quantity must be a number.',
    'number.min': 'Quantity must be at least 1.',
  }),
  unit: Joi.string()
    .default('unit')
    .valid('unit', 'g', 'kg', 'oz', 'lbs', 'ml', 'L') // Adjust valid units if needed
    .messages({
      'any.only': 'Unit must be one of [unit, g, kg, oz, lbs, ml, L].',
    }),
});

// Validation schema for updating a pantry ingredient
const updatePantryIngredientValidationSchema = Joi.object({
  pantryName: pantryNameValidator, // Validate pantryName
  ingredientId: Joi.string().required().custom(objectIdValidator).messages({
    'any.required': 'Ingredient ID is required.',
  }),
  quantity: Joi.number().integer().min(1).required().messages({
    'any.required': 'Quantity is required.',
    'number.base': 'Quantity must be a number.',
    'number.min': 'Quantity must be at least 1.',
  }),
  unit: Joi.string()
    .valid('unit', 'g', 'kg', 'oz', 'lbs', 'ml', 'L') // Adjust valid units if needed
    .messages({
      'any.only': 'Unit must be one of [unit, g, kg, oz, lbs, ml, L].',
    }),
});

// Validation schema for getting or deleting a pantry ingredient by ID
const getPantryIngredientValidationSchema = Joi.object({
  pantryName: pantryNameValidator, // Validate pantryName
  id: Joi.string().required().custom(objectIdValidator).messages({
    'any.required': 'Pantry ingredient ID is required.',
  }),
});

module.exports = {
  addPantryIngredientValidationSchema,
  updatePantryIngredientValidationSchema,
  getPantryIngredientValidationSchema,
};