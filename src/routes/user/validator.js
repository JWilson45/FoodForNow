const Joi = require('joi');

// User registration validation schema
const userValidationSchema = Joi.object({
  firstName: Joi.string().required().trim(),
  lastName: Joi.string().optional().trim(),
  username: Joi.string().required().trim().min(3).max(30),
  password: Joi.string().required().min(8),
  email: Joi.string().required().email(),
  dateOfBirth: Joi.date().optional(),
  phoneNumber: Joi.string()
    .optional()
    .pattern(/^\d{10}$/, '10-digit phone number'),
  profilePicture: Joi.binary().optional(),
});

// User login validation schema
const userLoginValidationSchema = Joi.object({
  username: Joi.string().required().trim().min(3).max(30),
  password: Joi.string().required().min(8),
});

module.exports = { userValidationSchema, userLoginValidationSchema };
