const Joi = require('joi');

// Define the user validation schema
const userValidationSchema = Joi.object({
  firstName: Joi.string().required().trim().messages({
    'string.empty': 'First name is required',
    'any.required': 'First name is required',
  }),
  lastName: Joi.string().optional().trim(),
  username: Joi.string().required().trim().min(3).max(30).messages({
    'string.empty': 'Username is required',
    'string.min': 'Username must be at least 3 characters long',
    'string.max': 'Username must not exceed 30 characters',
  }),
  password: Joi.string().required().min(8).messages({
    'string.empty': 'Password is required',
    'string.min': 'Password must be at least 8 characters long',
  }),
  email: Joi.string().required().email().messages({
    'string.empty': 'Email is required',
    'string.email': 'Please provide a valid email address',
  }),
  dateOfBirth: Joi.date().optional().messages({
    'date.base': 'Please provide a valid date of birth',
  }),
});

module.exports = { userValidationSchema };