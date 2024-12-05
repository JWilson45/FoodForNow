// Import the 'jsonwebtoken' library for working with JWT tokens
const jwt = require('jsonwebtoken');

// Import a utility function to check environment variables
const checkEnvVars = require('../utilities/checkEnvVars');

// Ensure the required environment variable 'JWT_SECRET_KEY' is set
checkEnvVars(['JWT_SECRET_KEY']);

/**
 * Middleware function to authenticate a user based on a JWT token.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @param {Function} next - The next middleware function in the stack.
 */
const authenticateUser = (req, res, next) => {
  try {
    // Retrieve the authentication token from cookies
    const token = req.cookies.authToken || req.headers.authorization;

    // If no token is found, respond with a 401 status indicating authentication is required
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Verify the token using the secret key from environment variables
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // Attach the decoded user information (e.g., userId and username) to the request object
    req.user = { userId: decoded.userId, username: decoded.username };

    // Proceed to the next middleware function
    next();
  } catch (error) {
    // Log the authentication error for debugging purposes
    console.error('Authentication error:', error.message);

    // Handle specific JWT errors with appropriate responses
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // For other errors, respond with a generic 500 status indicating a server issue
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Export the middleware function for use in other parts of the application
module.exports = authenticateUser;
