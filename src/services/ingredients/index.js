const Ingredient = require('../database/models/ingredient'); // Importing the Ingredient model
const {
  ingredientValidationSchema,
} = require('../../routes/ingredient/validator'); // Importing the Joi validation schema for ingredients

// Controller function to create a new ingredient
const createIngredient = async (req, res) => {
  try {
    // Validate the request body using Joi validation schema
    const { error, value } = ingredientValidationSchema.validate(req.body, {
      abortEarly: false, // Collect all errors, not just the first one
    });

    // If validation fails, return a 400 status with the error details
    if (error) {
      // Map over the validation errors and format them for the response
      const errors = error.details.map((detail) => ({
        field: detail.context.key, // Field name with validation error
        message: detail.message, // Error message from Joi
      }));
      return res.status(400).json({ errors }); // Return the errors with a 400 status
    }

    // Destructure the validated data from the request body
    const { name, description, calories, image, nutritionalInfo } = value;

    // Create a new instance of the Ingredient model with the validated data
    const newIngredient = new Ingredient({
      name,
      description,
      calories,
      image,
      nutritionalInfo,
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
