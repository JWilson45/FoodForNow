const Ingredient = require('../database/models/ingredient'); // Importing the Ingredient model

// Controller function to create a new ingredient
const createIngredient = async (req, res) => {
  try {
    // Destructure the validated data from the request body
    const { name, description, calories, image, nutritionalInfo } = req.body;

    // Create a new instance of the Ingredient model with the validated data
    const newIngredient = new Ingredient({
      name,
      description,
      calories,
      image,
      nutritionalInfo,
      createdBy: req.user.userId,
    });

    // Save the ingredient instance to the database
    await newIngredient.save();

    // Return a successful response with the created ingredient's data
    res.status(201).json({
      message: 'Ingredient created successfully',
      ingredient: {
        id: newIngredient._id, // Return the ingredient's ID
        name: newIngredient.name, // Return the ingredient's name
        description: newIngredient.description, // Return the description
        calories: newIngredient.calories, // Return the calorie count
        nutritionalInfo: newIngredient.nutritionalInfo, // Return nutritional info
        createdAt: newIngredient.createdAt, // Timestamp when the ingredient was created
        updatedAt: newIngredient.updatedAt, // Timestamp of the last update
      },
    });
  } catch (error) {
    // Handle any specific errors
    if (error.code === 11000) {
      // MongoDB duplicate key error (ingredient already exists)
      return res.status(409).json({
        error: 'Ingredient already exists',
        keyPattern: error.keyPattern, // Return the specific key that caused the conflict
      });
    }

    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message }); // Return the validation error message
    }

    // General error handling for other unexpected issues
    console.error(error); // Log the error for debugging purposes
    res.status(500).json({
      error: 'An unexpected error occurred while creating the ingredient',
    });
  }
};

module.exports = { createIngredient }; // Export the function for use in other parts of the application
