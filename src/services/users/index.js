const bcrypt = require('bcrypt');
const User = require('../database/models/user'); // Adjust the path as necessary

/**
 * Create a new user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const createUser = async (req, res) => {
  try {
    // Extract data from request body
    const {
      firstName,
      lastName,
      username,
      password,
      email,
      sex,
      dateOfBirth,
      phoneNumber,
      // address,
      profilePicture,
    } = req.body;

    // Validate required fields
    if (!firstName || !username || !password || !email || sex === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Additional validations
    if (password.length < 8) {
      return res
        .status(400)
        .json({ error: 'Password must be at least 8 characters long' });
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    if (phoneNumber && !/^\d{10}$/.test(phoneNumber)) {
      return res
        .status(400)
        .json({ error: 'Phone number must be exactly 10 digits' });
    }

    // In createUser function
    // if (address) {
    //   const { street, city, state, zipCode } = address; // Changed zipCode to zipCode
    //   if (!street || !city || !state || !zipCode) {
    //     return res.status(400).json({
    //       error: 'All address fields must be filled if address is provided',
    //     });
    //   }
    // }

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
      sex,
      dateOfBirth,
      phoneNumber,
      // address,
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
