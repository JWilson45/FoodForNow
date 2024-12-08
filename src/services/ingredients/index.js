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
        id: newIngredient._id,
        name: newIngredient.name,
        description: newIngredient.description,
        calories: newIngredient.calories,
        nutritionalInfo: newIngredient.nutritionalInfo,
        createdAt: newIngredient.createdAt,
        updatedAt: newIngredient.updatedAt,
      },
    });
  } catch (error) {
    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(409).json({
        error: 'Ingredient already exists',
        keyPattern: error.keyPattern,
      });
    }

    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }

    // General error handling
    console.error(error);
    res.status(500).json({
      error: 'An unexpected error occurred while creating the ingredient',
    });
  }
};

// Controller function to get all ingredients
const getIngredients = async (_, res) => {
  try {
    const ingredients = await Ingredient.find({}).lean();

    // Return all ingredients as a JSON response
    res.status(200).json({ ingredients });
  } catch (error) {
    console.error('Error fetching ingredients:', error);
    res.status(500).json({
      error: 'An error occurred while fetching the ingredients',
    });
  }
};

module.exports = { createIngredient, getIngredients };
