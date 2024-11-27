const bcrypt = require('bcrypt');
const User = require('../database/models/user');
const jwt = require('jsonwebtoken');

const createUser = async (req, res) => {
  try {
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

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user instance
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

    // Save the user to the database
    await newUser.save();

    // Return success response
    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.maskedEmail,
        recentlyLoggedIn: newUser.recentlyLoggedIn,
        isActive: newUser.isActive,
        username: newUser.username,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      console.log(error.errorResponse);

      return res.status(409).json({
        error: 'User Already Exists',
        keyPattern: error.errorResponse?.keyPattern,
      });
    }

    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }

    console.error(error);
    res
      .status(500)
      .json({ error: 'An unexpected error occurred while creating the user' });
  }
};

const signInUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find the user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: 'Invalid username or password' });
    }

    // Validate the password
    const isPasswordValid = await bcrypt.compare(password, user.hashedPassword);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET_KEY,
      { expiresIn: '1h' }
    );

    // Set the token as an HTTP-only cookie
    res.cookie('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600000,
    });

    res.status(200).json({
      message: 'Sign-in successful',
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.maskedEmail,
        recentlyLoggedIn: user.recentlyLoggedIn,
        isActive: user.isActive,
        username: user.username,
      },
    });
  } catch (error) {
    console.error('Error during sign-in:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { createUser, signInUser };
