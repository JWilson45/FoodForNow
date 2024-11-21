const bcrypt = require('bcrypt');
const User = require('../database/models/user');

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

    // Check for existing username or email
    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });
    if (existingUser) {
      return res.status(409).json({
        error: 'Username or email already exists',
      });
    }

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
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(409)
        .json({ error: 'Username or email already exists' });
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

module.exports = createUser;
