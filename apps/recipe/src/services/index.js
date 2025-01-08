const Recipe = require('../database/models/recipe');

// Create a new recipe
const createRecipe = async (req, res) => {
  try {
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

    await newRecipe.save();

    res.status(201).json({
      message: 'Recipe created successfully',
      recipe: {
        ...newRecipe.toObject(),
        id: newRecipe._id,
        totalTime: newRecipe.totalTime,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(409)
        .json({ error: 'Recipe already exists', keyPattern: error.keyPattern });
    }

    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }

    console.error(error);
    res.status(500).json({
      error: 'An unexpected error occurred while creating the recipe',
    });
  }
};

// Get all recipes for the authenticated user
const getUserRecipes = async (req, res) => {
  try {
    const userId = req.user.userId;
    const recipes = await Recipe.find({ owner: userId });

    res.status(200).json({
      message: 'Recipes fetched successfully',
      recipes,
    });
  } catch (error) {
    console.error('Error fetching user recipes:', error);
    res
      .status(500)
      .json({ error: 'An error occurred while fetching the recipes' });
  }
};

// Get a single recipe by ID (ownership enforced)
const getRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const recipe = await Recipe.findOne({ _id: id, owner: userId });
    if (!recipe) {
      return res
        .status(404)
        .json({ error: 'Recipe not found or not authorized' });
    }

    res.status(200).json({
      message: 'Recipe fetched successfully',
      recipe,
    });
  } catch (error) {
    console.error('Error fetching recipe:', error);
    res
      .status(500)
      .json({ error: 'An error occurred while fetching the recipe' });
  }
};

// Update a recipe (ownership enforced)
const updateRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const updateData = req.body;

    const updatedRecipe = await Recipe.findOneAndUpdate(
      { _id: id, owner: userId },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedRecipe) {
      return res
        .status(404)
        .json({ error: 'Recipe not found or not authorized' });
    }

    res.status(200).json({
      message: 'Recipe updated successfully',
      recipe: updatedRecipe.toObject(),
    });
  } catch (error) {
    console.error('Error updating recipe:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }

    res
      .status(500)
      .json({ error: 'An error occurred while updating the recipe' });
  }
};

// Delete a recipe (ownership enforced)
const deleteRecipe = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    const deletedRecipe = await Recipe.findOneAndDelete({
      _id: id,
      owner: userId,
    });
    if (!deletedRecipe) {
      return res
        .status(404)
        .json({ error: 'Recipe not found or not authorized' });
    }

    res.status(200).json({ message: 'Recipe deleted successfully' });
  } catch (error) {
    console.error('Error deleting recipe:', error);
    res
      .status(500)
      .json({ error: 'An error occurred while deleting the recipe' });
  }
};

module.exports = {
  createRecipe,
  getUserRecipes,
  getRecipe,
  updateRecipe,
  deleteRecipe,
};
