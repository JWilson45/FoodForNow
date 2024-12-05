// Import the Joi validation library
const Joi = require('joi');

// Define the ingredient validation schema with detailed custom error messages
const createIngredientValidationSchema = Joi.object({
  // Name is required, must be a string, and cannot be empty
  name: Joi.string().required().trim().messages({
    'string.base': 'Name must be a string.', // Error for invalid type
    'string.empty': 'Name is required and cannot be empty.', // Error for empty value
    'any.required': 'Name is a required field.', // Error for missing value
  }),

  // Description is optional but must be a trimmed string if provided
  description: Joi.string().optional().trim().messages({
    'string.base': 'Description must be a string.', // Error for invalid type
    'string.empty': 'Description cannot be empty if provided.', // Error for empty value
  }),

  // Calories is optional but must be a number if provided
  calories: Joi.number().optional().messages({
    'number.base': 'Calories must be a number.', // Error for invalid type
  }),

  // Image is optional and must be a binary file format
  image: Joi.binary().optional().messages({
    'binary.base': 'Image must be a binary file format.', // Error for invalid type
  }), // Replace with Joi.string().uri() if using image URLs

  // Nutritional information is optional and must be an object with specific numeric properties
  nutritionalInfo: Joi.object({
    // Each nutritional field is optional but must be a number if provided
    fat: Joi.number().optional().messages({
      'number.base': 'Fat content must be a number.', // Error for invalid type
    }),
    protein: Joi.number().optional().messages({
      'number.base': 'Protein content must be a number.', // Error for invalid type
    }),
    carbohydrates: Joi.number().optional().messages({
      'number.base': 'Carbohydrates content must be a number.', // Error for invalid type
    }),
    fiber: Joi.number().optional().messages({
      'number.base': 'Fiber content must be a number.', // Error for invalid type
    }),
  })
    .optional()
    .messages({
      'object.base': 'Nutritional information must be an object.', // Error for invalid type
    }),
});

// Export the ingredient validation schema for use in routes and middleware
module.exports = { createIngredientValidationSchema };
