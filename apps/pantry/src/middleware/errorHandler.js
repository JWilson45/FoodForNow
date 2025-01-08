// src/middleware/errorHandler.js

/**
 * Centralized Error Handling Middleware
 *
 * @param {Error} err - The error object.
 * @param {Request} req - The HTTP request object.
 * @param {Response} res - The HTTP response object.
 * @param {Function} next - The next middleware function.
 */
const errorHandler = (err, req, res, next) => {
  console.error('Unhandled Error:', err.stack);

  // Handle MongoDB duplicate key errors (e.g., unique constraint violations)
  if (err.code === 11000) {
    return res.status(409).json({ error: 'Duplicate entry detected.' });
  }

  // Handle Mongoose validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message });
  }

  // Handle missing resource errors
  if (err.statusCode === 404) {
    return res.status(404).json({ error: 'Resource not found.' });
  }

  // Default to a generic 500 Internal Server Error for unhandled errors
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    error: message,
  });
};

module.exports = errorHandler;