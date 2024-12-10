const bcrypt = require('bcrypt'); // Import bcrypt for password hashing
const User = require('../database/models/user'); // Import User model to interact with the database
const jwt = require('jsonwebtoken'); // Import jsonwebtoken for generating JWT tokens

// Controller function to create a new user
const createUser = async (req, res) => {
  try {
    // Destructure the necessary fields from the request body
    const {
      firstName,
      lastName,
      username,
      password,
      email,
      dateOfBirth,
      phoneNumber,
      profilePicture,
    } = req.body;

    // Hash the password using bcrypt
    const salt = await bcrypt.genSalt(10); // Generate a salt with 10 rounds
    const hashedPassword = await bcrypt.hash(password, salt); // Hash the password with the salt

    // Create a new User instance with the provided data
    const newUser = new User({
      firstName,
      lastName,
      username,
      hashedPassword,
      email,
      dateOfBirth,
      phoneNumber,
      profilePicture,
    });

    // Save the new user to the database
    await newUser.save();

    // Return a success response with the newly created user's details (excluding password)
    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: newUser._id,
        fullName: newUser.fullName, // Full name based on the user's first and last name
        email: newUser.maskedEmail, // Masked email for privacy
        recentlyLoggedIn: newUser.recentlyLoggedIn, // Boolean to check if the user logged in recently
        isActive: newUser.isActive, // Boolean to check if the user is active
        username: newUser.username, // The username of the user
      },
    });
  } catch (error) {
    // Handle errors during user creation
    if (error.code === 11000) {
      // Duplicate key error (e.g., username or email already exists)
      console.log(error.errorResponse);

      return res.status(409).json({
        error: 'User Already Exists',
        keyPattern: error.errorResponse?.keyPattern, // Return the key that caused the conflict
      });
    }

    // Handle validation errors (if any)
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }

    // General error handling for unexpected errors
    console.error(error);
    res
      .status(500)
      .json({ error: 'An unexpected error occurred while creating the user' });
  }
};

// Controller function to sign in an existing user
const signInUser = async (req, res) => {
  try {
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
    // Handle errors during sign-in
    console.error('Error during sign-in:', error.message);
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

    // Return the decoded token data
    return res.status(200).json({
      message: 'User is logged in',
      user: {
        userId: decoded.userId,
        username: decoded.username,
      },
    });
  } catch (error) {
    // Handle invalid or expired token
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

module.exports = { createUser, signInUser, checkIfLoggedIn }; // Export the functions for use in other parts of the application
