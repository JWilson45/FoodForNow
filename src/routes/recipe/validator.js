// Import the Joi validation library
const Joi = require('joi');
const mongoose = require('mongoose');

// Define the recipe ingredient validation schema
const recipeIngredientValidationSchema = Joi.object({
  ingredientId: Joi.string()
    .required()
    .custom((value, helpers) => {
      // Validate that the string is a valid ObjectId
      if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.message('ingredientId must be a valid ObjectId');
      }
      return value;
    }),
  amount: Joi.number().required().min(0).messages({
    'number.base': 'Amount must be a number.',
    'number.min': 'Amount must be at least 0.',
    'any.required': 'Amount is required.',
  }),
  unit: Joi.string().required().trim().messages({
    'string.base': 'Unit must be a string.',
    'string.empty': 'Unit is required.',
    'any.required': 'Unit is required.',
  }),
  notes: Joi.string().optional().trim().messages({
    'string.base': 'Notes must be a string.',
  }),
});

// Define the recipe validation schema with detailed custom error messages
const createRecipeValidationSchema = Joi.object({
  // Name is required, must be a string, and cannot be empty
  name: Joi.string().required().trim().messages({
    'string.base': 'Name must be a string.',
    'string.empty': 'Name is required and cannot be empty.',
    'any.required': 'Name is a required field.',
  }),

  // Alias is optional, must be a string, and trimmed
  alias: Joi.string().optional().trim().messages({
    'string.base': 'Alias must be a string.',
  }),

  // Description is optional, must be a string, trimmed, and max length 1000
  description: Joi.string().optional().trim().max(1000).messages({
    'string.base': 'Description must be a string.',
    'string.max': 'Description must be at most 1000 characters long.',
  }),

  // Instructions are required, must be an array of strings
  instructions: Joi.array()
    .items(
      Joi.string().trim().required().messages({
        'string.base': 'Each instruction must be a string.',
        'string.empty': 'Instructions cannot contain empty strings.',
        'any.required': 'Instruction is required.',
      })
    )
    .min(1)
    .required()
    .messages({
      'array.base': 'Instructions must be an array.',
      'array.min': 'At least one instruction is required.',
      'any.required': 'Instructions are required.',
    }),

  // Ingredients are required, must be an array of recipeIngredientValidationSchema
  ingredients: Joi.array()
    .items(recipeIngredientValidationSchema)
    .min(1)
    .required()
    .messages({
      'array.base': 'Ingredients must be an array.',
      'array.min': 'At least one ingredient is required.',
      'any.required': 'Ingredients are required.',
    }),

  // isPublic is optional, defaults to false, must be boolean
  isPublic: Joi.boolean().optional().messages({
    'boolean.base': 'isPublic must be a boolean.',
  }),

  // Type is optional, must be a string
  type: Joi.string().optional().trim().messages({
    'string.base': 'Type must be a string.',
  }),

  // MealTime is optional, must be one of specified values
  mealTime: Joi.string()
    .optional()
    .trim()
    .valid('breakfast', 'lunch', 'dinner', 'snack', 'dessert')
    .messages({
      'string.base': 'MealTime must be a string.',
      'any.only':
        'MealTime must be one of [breakfast, lunch, dinner, snack, dessert].',
    }),

  // Cuisine is optional, must be one of specified values
  cuisine: Joi.string()
    .optional()
    .trim()
    .valid('italian', 'chinese', 'mexican', 'indian', 'american', 'other')
    .messages({
      'string.base': 'Cuisine must be a string.',
      'any.only':
        'Cuisine must be one of [italian, chinese, mexican, indian, american, other].',
    }),

  // Servings are required, must be a number
  servings: Joi.number().required().messages({
    'number.base': 'Servings must be a number.',
    'any.required': 'Servings are required.',
  }),

  // PrepTime is required, must be a number
  prepTime: Joi.number().required().messages({
    'number.base': 'PrepTime must be a number.',
    'any.required': 'PrepTime is required.',
  }),

  // CookTime is required, must be a number
  cookTime: Joi.number().required().messages({
    'number.base': 'CookTime must be a number.',
    'any.required': 'CookTime is required.',
  }),

  // Calories are optional, must be a number
  calories: Joi.number().optional().messages({
    'number.base': 'Calories must be a number.',
  }),

  // Tags are optional, must be an array of strings
  tags: Joi.array()
    .items(
      Joi.string().trim().messages({
        'string.base': 'Each tag must be a string.',
      })
    )
    .optional()
    .messages({
      'array.base': 'Tags must be an array of strings.',
    }),
});

module.exports = { createRecipeValidationSchema };
