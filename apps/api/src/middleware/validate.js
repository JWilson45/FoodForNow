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
    try {
      // Check if the target exists on the request object
      if (!req[target]) {
        console.error(`Validation target "${target}" is missing from the request.`);
        return res.status(400).json({ error: `Invalid request target: ${target}` });
      }

      // Validate the specified part of the request against the schema
      const { error, value } = schema.validate(req[target], { abortEarly: false, stripUnknown: true });

      // If there are validation errors, format and respond with a 400 status code
      if (error) {
        const formattedErrors = error.details.map((detail) => ({
          field: detail.context.key || 'unknown',
          message: detail.message.replace(/["']/g, ''), // Clean up error messages by removing unnecessary quotes
        }));

        console.error('Validation errors:', formattedErrors); // Log validation errors for debugging
        return res.status(400).json({ errors: formattedErrors });
      }

      // Replace the request target with the validated and sanitized value
      req[target] = value;

      // Proceed to the next middleware
      next();
    } catch (err) {
      console.error('Unexpected error in validation middleware:', err); // Log unexpected errors
      res.status(500).json({ error: 'Internal server error during validation' });
    }
  };

// Export the validate middleware factory for use in other parts of the application
module.exports = validate;