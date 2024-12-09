// src/middleware/validate.js

/**
 * Middleware factory function to validate request payloads against a provided schema.
 *
 * @param {Object} schema - The validation schema (e.g., Joi schema) to validate the request against.
 * @param {String} target - The part of the request to validate ('body', 'params', 'query').
 * @returns {Function} A middleware function for validating the specified part of the request.
 */
const validate =
  (schema, target = 'body') =>
  (req, res, next) => {
    // Check if the target exists on the request object
    if (!req[target]) {
      return res
        .status(400)
        .json({ error: `Invalid request target: ${target}` });
    }

    // Validate the specified part of the request against the schema
    const { error } = schema.validate(req[target], { abortEarly: false });

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