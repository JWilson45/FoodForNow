// Import the Joi validation library
const Joi = require('joi');

// Validation schema for user registration
const userValidationSchema = Joi.object({
  // First name is required and must be a trimmed string
  firstName: Joi.string().required().trim(),

  // Last name is optional but must be a trimmed string if provided
  lastName: Joi.string().optional().trim(),

  // Username is required, must be a trimmed string between 3 and 30 characters
  username: Joi.string().required().trim().min(3).max(30),

  // Password is required and must be at least 8 characters long
  password: Joi.string().required().min(8),

  // Email is required and must be in a valid email format
  email: Joi.string().required().email(),

  // Date of birth is optional but must be a valid date if provided
  dateOfBirth: Joi.date().optional(),

  // Phone number is optional but must match the pattern for a 10-digit number if provided
  phoneNumber: Joi.string()
    .optional()
    .pattern(/^\d{10}$/, '10-digit phone number'),

  // Profile picture is optional and must be in binary format if provided
  profilePicture: Joi.binary().optional(),
});

// Validation schema for user login
const userLoginValidationSchema = Joi.object({
  // Username is required, must be a trimmed string between 3 and 30 characters
  username: Joi.string().required().trim().min(3).max(30),

  // Password is required and must be at least 8 characters long
  password: Joi.string().required().min(8),
});

// Export the validation schemas for use in routes and middleware
module.exports = { userValidationSchema, userLoginValidationSchema };
