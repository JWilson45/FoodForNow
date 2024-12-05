// recipes
const Recipe = require('../database/models/recipe'); // Importing the Recipe model

// Controller function to create a new recipe
const createRecipe = async (req, res) => {
  try {
    // Destructure the data from the request body (already validated in the route)
    const {
      name,
      alias,
      description,
      instructions,
      ingredients,
      isPublic,
      type,
      mealTime,
      cuisine,
      servings,
      prepTime,
      cookTime,
      calories,
      tags,
    } = req.body;

    // Create a new instance of the Recipe model with the data
    const newRecipe = new Recipe({
      owner: req.user.userId,
      name,
      alias,
      description,
      instructions,
      ingredients,
      isPublic,
      type,
      mealTime,
      cuisine,
      servings,
      prepTime,
      cookTime,
      calories,
      tags,
    });

    // Save the recipe instance to the database
    await newRecipe.save();

    // Return a successful response with the created recipe's data
    res.status(201).json({
      message: 'Recipe created successfully',
      recipe: {
        id: newRecipe._id, // Return the recipe's ID
        name: newRecipe.name, // Return the recipe's name
        alias: newRecipe.alias,
        description: newRecipe.description,
        instructions: newRecipe.instructions,
        ingredients: newRecipe.ingredients,
        isPublic: newRecipe.isPublic,
        type: newRecipe.type,
        mealTime: newRecipe.mealTime,
        cuisine: newRecipe.cuisine,
        servings: newRecipe.servings,
        prepTime: newRecipe.prepTime,
        cookTime: newRecipe.cookTime,
        calories: newRecipe.calories,
        tags: newRecipe.tags,
        totalTime: newRecipe.totalTime, // Include the virtual field
        createdAt: newRecipe.createdAt,
        updatedAt: newRecipe.updatedAt,
      },
    });
  } catch (error) {
    // Handle specific errors
    if (error.code === 11000) {
      // MongoDB duplicate key error (unique field conflict)
      return res.status(409).json({
        error: 'Recipe already exists',
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
      error: 'An unexpected error occurred while creating the recipe',
    });
  }
};

// Function to get recipes for a specific user
const getUserRecipes = async (req, res) => {
  try {
    // Extract the userId from the authenticated request
    const userId = req.user.userId;

    // Fetch recipes owned by this user from the database
    const recipes = await Recipe.find({ owner: userId });

    // Return the recipes in the response
    res.status(200).json({
      message: 'Recipes fetched successfully',
      recipes,
    });
  } catch (error) {
    console.error('Error fetching user recipes:', error);

    // Handle unexpected errors
    res.status(500).json({
      error: 'An error occurred while fetching the recipes',
    });
  }
};

module.exports = { createRecipe, getUserRecipes };
