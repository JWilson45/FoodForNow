/**
 * Middleware factory function to validate request payloads against a provided schema.
 */
const validate =
  (schema, target = 'body') =>
  (req, res, next) => {
    if (!req[target]) {
      return res.status(400).json({ error: `Invalid request target: ${target}` });
    }

    const { error } = schema.validate(req[target], { abortEarly: false });

    if (error) {
      const formattedErrors = error.details.map((detail) => ({
        field: detail.context.key,
        message: detail.message.replace(/["']/g, ''),
      }));

      console.error(`Validation error on ${target}:`, formattedErrors);
      return res.status(400).json({ errors: formattedErrors });
    }

    next();
  };

module.exports = validate;