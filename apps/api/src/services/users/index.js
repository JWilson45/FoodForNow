const bcrypt = require('bcrypt'); // Import bcrypt for password hashing
const User = require('../database/models/user'); // Import User model to interact with the database
const jwt = require('jsonwebtoken'); // Import jsonwebtoken for generating JWT tokens

// Controller function to create a new user
const createUser = async (req, res) => {
  try {
    console.log('Incoming data for user creation:', req.body); // Log the incoming request

    const { firstName, lastName, username, password, email, dateOfBirth } = req.body;

    // Validate critical fields
    if (!firstName || !username || !password || !email) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (typeof firstName !== 'string' || typeof username !== 'string' || typeof email !== 'string') {
      return res.status(400).json({ error: 'Invalid data types' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      firstName,
      lastName: lastName || null, // Handle optional fields
      username,
      hashedPassword,
      email,
      dateOfBirth: dateOfBirth || null, // Handle optional fields
    });

    await newUser.save();

    console.log('User created successfully:', newUser._id); // Log the new user's ID

    res.status(201).json({ message: 'User created successfully', userId: newUser._id });
  } catch (error) {
    console.error('Error during user creation:', error.message); // Log the error

    if (error.code === 11000) {
      return res.status(409).json({ error: 'Username or email already exists' });
    }

    res.status(500).json({ error: 'Internal server error' });
  }
};

// Controller function to sign in an existing user
const signInUser = async (req, res) => {
  try {
    console.log('Incoming data for sign-in:', req.body); // Log incoming request body

    const { username, password } = req.body;

    const user = await User.findOne({ username }).collation({
      locale: 'en',
      strength: 2,
    });

    if (!user) {
      return res.status(404).json({ error: 'Invalid username or password' });
    }

    // Validate the password against the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.hashedPassword);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Generate a JWT token for authentication
    const token = jwt.sign(
      { userId: user._id, username: user.username }, // Payload containing user ID and username
      process.env.JWT_SECRET_KEY, // Secret key to sign the token (stored in environment variables)
      { expiresIn: '1h' } // Set the expiration time for the token (1 hour)
    );

    // Set the JWT token in an HTTP-only cookie for secure session management
    res.cookie('authToken', token, {
      httpOnly: true, // Ensures the cookie can't be accessed via JavaScript
      secure: process.env.NODE_ENV === 'production', // Use secure cookies only in production
      sameSite: 'strict', // Restrict cookie to first-party context
      maxAge: 3600000, // Set cookie expiration time (1 hour)
    });

    console.log('User signed in successfully:', user._id); // Log the user's ID

    // Return a success response with user details (excluding password)
    res.status(200).json({
      message: 'Sign-in successful',
      user: {
        id: user._id,
        fullName: user.fullName, // Full name based on the user's first and last name
        email: user.maskedEmail, // Masked email for privacy
        recentlyLoggedIn: user.recentlyLoggedIn, // Boolean to check if the user logged in recently
        isActive: user.isActive, // Boolean to check if the user is active
        username: user.username, // The username of the user
      },
    });
  } catch (error) {
    console.error('Error during sign-in:', error.message); // Log the error
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Function to check if a user is logged in and decode the token
const checkIfLoggedIn = (req, res) => {
  const token = req.cookies.authToken;

  // Check if the token is missing
  if (!token) {
    return res.status(401).json({ error: 'User is not logged in' });
  }

  try {
    // Decode the token using the secret key
    const decoded = jwt.decode(token);

    console.log('User is logged in:', decoded.userId); // Log the user's ID from the token

    // Return the decoded token data
    return res.status(200).json({
      message: 'User is logged in',
      user: {
        userId: decoded.userId,
        username: decoded.username,
      },
    });
  } catch (error) {
    console.error('Error decoding token:', error.message); // Log the error
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

module.exports = { createUser, signInUser, checkIfLoggedIn }; // Export the functions for use in other parts of the application