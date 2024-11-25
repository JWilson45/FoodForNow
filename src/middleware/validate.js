const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const formattedErrors = error.details.map((detail) => ({
      field: detail.context.key,
      message: detail.message.replace(/["']/g, ''), // Remove unnecessary quotes
    }));
    return res.status(400).json({ errors: formattedErrors });
  }
  next();
};

module.exports = validate;
