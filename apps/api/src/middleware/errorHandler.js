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

  // Customize error response based on error type or environment
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    error: message,
  });
};

module.exports = errorHandler;
