// src/middleware/authentication.js

const jwt = require('jsonwebtoken');
const checkEnvVars = require('../utilities/checkEnvVars');

checkEnvVars(['JWT_SECRET_KEY']);

/**
 * Middleware to authenticate users using JWT tokens.
 *
 * @param {Request} req - The HTTP request object.
 * @param {Response} res - The HTTP response object.
 * @param {Function} next - The next middleware function.
 */
const authenticateUser = (req, res, next) => {
  try {
    let token;

    // Extract token from Authorization header (Bearer token)
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }

    // If not in header, try to get it from cookies
    if (!token) {
      token = req.cookies.authToken;
    }

    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // Attach user info to request
    req.user = { userId: decoded.userId, username: decoded.username };

    next();
  } catch (error) {
    console.error('Authentication error:', error.message);

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }

    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = authenticateUser;
