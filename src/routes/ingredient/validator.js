const Joi = require('joi');

// Ingredient validation schema with custom error messages
const ingredientValidationSchema = Joi.object({
  name: Joi.string().required().trim().messages({
    'string.base': 'Name must be a string.',
    'string.empty': 'Name is required and cannot be empty.',
    'any.required': 'Name is a required field.',
  }),
  description: Joi.string().optional().trim().messages({
    'string.base': 'Description must be a string.',
    'string.empty': 'Description cannot be empty if provided.',
  }),
  calories: Joi.number().optional().messages({
    'number.base': 'Calories must be a number.',
  }),
  image: Joi.binary().optional().messages({
    'binary.base': 'Image must be a binary file format.',
  }), // Replace with Joi.string().uri() if using image URLs
  nutritionalInfo: Joi.object({
    fat: Joi.number().optional().messages({
      'number.base': 'Fat content must be a number.',
    }),
    protein: Joi.number().optional().messages({
      'number.base': 'Protein content must be a number.',
    }),
    carbohydrates: Joi.number().optional().messages({
      'number.base': 'Carbohydrates content must be a number.',
    }),
    fiber: Joi.number().optional().messages({
      'number.base': 'Fiber content must be a number.',
    }),
  })
    .optional()
    .messages({
      'object.base': 'Nutritional information must be an object.',
    }),
});

module.exports = { ingredientValidationSchema };
