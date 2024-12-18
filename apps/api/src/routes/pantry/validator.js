const Joi = require('joi');
const mongoose = require('mongoose');

// Validator for MongoDB ObjectId
const objectIdValidator = (value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.message('Invalid ingredient ID.');
  }
  return value;
};

// Validation schema for creating a pantry
const createPantryValidationSchema = Joi.object({
  pantryName: Joi.string()
    .min(1)
    .max(100)
    .required()
    .default('Home')
    .messages({
      'any.required': 'Pantry name is required.',
      'string.empty': 'Pantry name cannot be empty.',
      'string.min': 'Pantry name must be at least 1 character long.',
      'string.max': 'Pantry name must not exceed 100 characters.',
    }),
});

// Validation schema for adding an ingredient to the pantry
const addPantryIngredientValidationSchema = Joi.object({
  pantryName: Joi.string().default('Home'),
  ingredientId: Joi.string().required().custom(objectIdValidator).messages({
    'any.required': 'Ingredient ID is required.',
  }),
  quantity: Joi.number().integer().min(1).required().messages({
    'any.required': 'Quantity is required.',
    'number.base': 'Quantity must be a number.',
    'number.integer': 'Quantity must be an integer.',
    'number.min': 'Quantity must be at least 1.',
  }),
  unit: Joi.string()
    .valid('unit', 'g', 'kg', 'oz', 'lbs', 'ml', 'L')
    .default('unit')
    .messages({
      'any.only': 'Unit must be one of [unit, g, kg, oz, lbs, ml, L].',
    }),
});

// Validation schema for updating a pantry ingredient
const updatePantryIngredientValidationSchema = Joi.object({
  pantryName: Joi.string().default('Home'),
  ingredientId: Joi.string().required().custom(objectIdValidator).messages({
    'any.required': 'Ingredient ID is required.',
  }),
  quantity: Joi.number().integer().min(1).required().messages({
    'any.required': 'Quantity is required.',
    'number.base': 'Quantity must be a number.',
    'number.integer': 'Quantity must be an integer.',
    'number.min': 'Quantity must be at least 1.',
  }),
  unit: Joi.string()
    .valid('unit', 'g', 'kg', 'oz', 'lbs', 'ml', 'L')
    .messages({
      'any.only': 'Unit must be one of [unit, g, kg, oz, lbs, ml, L].',
    }),
});

// Validation schema for getting or deleting a pantry ingredient by ID
const getPantryIngredientValidationSchema = Joi.object({
  pantryName: Joi.string().default('Home'),
  id: Joi.string().required().custom(objectIdValidator).messages({
    'any.required': 'Pantry ingredient ID is required.',
  }),
});

module.exports = {
  createPantryValidationSchema,
  addPantryIngredientValidationSchema,
  updatePantryIngredientValidationSchema,
  getPantryIngredientValidationSchema,
};