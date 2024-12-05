/**
 * Middleware factory function to validate request payloads against a provided schema.
 *
 * @param {Object} schema - The validation schema (e.g., Joi schema) to validate the request body against.
 * @returns {Function} A middleware function for validating the request body.
 */
const validate = (schema) => (req, res, next) => {
  console.log(req.body);

  // Validate the request body against the schema
  const { error } = schema.validate(req.body, { abortEarly: false });

  // If there are validation errors, format and respond with a 400 status code
  if (error) {
    const formattedErrors = error.details.map((detail) => ({
      field: detail.context.key, // The field that caused the validation error
      message: detail.message.replace(/["']/g, ''), // Clean up error messages by removing unnecessary quotes
    }));

    // Respond with a 400 status and an array of validation error details
    return res.status(400).json({ errors: formattedErrors });
  }

  // If validation passes, proceed to the next middleware
  next();
};

// Export the validate middleware factory for use in other parts of the application
module.exports = validate;
