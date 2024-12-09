// src/routes/meal/validator.js

const Joi = require('joi');
const mongoose = require('mongoose');

// Custom validator for ObjectId fields
const objectIdValidator = (value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.message('must be a valid ObjectId');
  }
  return value;
};

// Validation schema for creating a meal
const createMealValidationSchema = Joi.object({
  name: Joi.string().required().trim().messages({
    'string.empty': 'Name is required.',
    'any.required': 'Name is a required field.',
  }),
  description: Joi.string().optional().trim(),
  recipes: Joi.array()
    .items(Joi.string().required().custom(objectIdValidator))
    .min(1)
    .required()
    .messages({
      'array.min': 'At least one recipe is required.',
      'any.required': 'Recipes are required.',
    }),
  mealTime: Joi.string().optional().trim(),
  servings: Joi.number().required().messages({
    'number.base': 'Servings must be a number.',
    'any.required': 'Servings are required.',
  }),
  calories: Joi.number().optional(),
  tags: Joi.array().items(Joi.string().trim()).optional(),
  isVegetarian: Joi.boolean().optional(),
  isVegan: Joi.boolean().optional(),
  cuisine: Joi.string().optional().trim(),
});

// Validation schema for updating a meal
const updateMealValidationSchema = Joi.object({
  name: Joi.string().optional().trim(),
  description: Joi.string().optional().trim(),
  recipes: Joi.array()
    .items(Joi.string().required().custom(objectIdValidator))
    .min(1)
    .optional(),
  mealTime: Joi.string().optional().trim(),
  servings: Joi.number().optional(),
  calories: Joi.number().optional(),
  tags: Joi.array().items(Joi.string().trim()).optional(),
  isVegetarian: Joi.boolean().optional(),
  isVegan: Joi.boolean().optional(),
  cuisine: Joi.string().optional().trim(),
});

// Validation schema for getting/deleting a meal by ID
const getMealValidationSchema = Joi.object({
  id: Joi.string().required().custom(objectIdValidator).messages({
    'any.required': 'Meal ID is required.',
  }),
});

module.exports = {
  createMealValidationSchema,
  updateMealValidationSchema,
  getMealValidationSchema,
};
