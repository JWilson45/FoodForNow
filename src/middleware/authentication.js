const jwt = require('jsonwebtoken');

const authenticateUser = (req, res, next) => {
  try {
    // Retrieve the token from cookies
    const token = req.cookies.authToken;
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Verify the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // Attach user information to the request object
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
