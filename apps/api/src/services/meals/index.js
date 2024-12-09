// src/services/meals/index.js

const Meal = require('../database/models/meal');
const Recipe = require('../database/models/recipe'); // For validation if needed

// Create a new meal
const createMeal = async (req, res) => {
  try {
    const {
      name,
      description,
      recipes,
      mealTime,
      servings,
      calories,
      tags,
      isVegetarian,
      isVegan,
      cuisine,
    } = req.body;

    const newMeal = new Meal({
      owner: req.user.userId,
      name,
      description,
      recipes,
      mealTime,
      servings,
      calories,
      tags,
      isVegetarian,
      isVegan,
      cuisine,
    });

    await newMeal.save();

    // Populate recipes to compute virtual fields
    await newMeal.populate('recipes', 'prepTime cookTime');

    res.status(201).json({
      message: 'Meal created successfully',
      meal: {
        id: newMeal._id,
        name: newMeal.name,
        description: newMeal.description,
        recipes: newMeal.recipes,
        mealTime: newMeal.mealTime,
        servings: newMeal.servings,
        calories: newMeal.calories,
        tags: newMeal.tags,
        isVegetarian: newMeal.isVegetarian,
        isVegan: newMeal.isVegan,
        cuisine: newMeal.cuisine,
        prepTime: newMeal.prepTime,
        cookTime: newMeal.cookTime,
        totalTime: newMeal.totalTime,
        createdAt: newMeal.createdAt,
        updatedAt: newMeal.updatedAt,
      },
    });
  } catch (error) {
    console.error('Error creating meal:', error);
    if (error.code === 11000) {
      return res.status(409).json({ error: 'Meal already exists' });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
};

// Get all meals for the authenticated user
const getMeals = async (req, res) => {
  try {
    const userId = req.user.userId;
    const meals = await Meal.find({ owner: userId })
      .populate('recipes', 'prepTime cookTime name')
      .lean(); // Convert to plain JS objects

    res.status(200).json({
      message: 'Meals fetched successfully',
      meals: meals.map((meal) => ({
        ...meal,
        prepTime: meal.recipes.reduce((sum, r) => sum + (r.prepTime || 0), 0),
        cookTime: meal.recipes.reduce((sum, r) => sum + (r.cookTime || 0), 0),
        totalTime:
          meal.recipes.reduce((sum, r) => sum + (r.prepTime || 0), 0) +
          meal.recipes.reduce((sum, r) => sum + (r.cookTime || 0), 0),
      })),
    });
  } catch (error) {
    console.error('Error fetching meals:', error);
    res
      .status(500)
      .json({ error: 'An error occurred while fetching the meals' });
  }
};

// Get a specific meal by ID
const getMeal = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const meal = await Meal.findOne({ _id: id, owner: userId }).populate(
      'recipes',
      'prepTime cookTime name'
    );

    if (!meal) {
      return res.status(404).json({ error: 'Meal not found' });
    }

    res.status(200).json({
      message: 'Meal fetched successfully',
      meal: meal.toObject(), // Ensure virtuals are included
    });
  } catch (error) {
    console.error('Error fetching meal:', error);
    res
      .status(500)
      .json({ error: 'An error occurred while fetching the meal' });
  }
};

// Update a specific meal
const updateMeal = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const updatedMeal = await Meal.findOneAndUpdate(
      { _id: id, owner: userId },
      { $set: req.body },
      { new: true, runValidators: true }
    ).populate('recipes', 'prepTime cookTime name');

    if (!updatedMeal) {
      return res
        .status(404)
        .json({ error: 'Meal not found or not authorized' });
    }

    res.status(200).json({
      message: 'Meal updated successfully',
      meal: updatedMeal.toObject(),
    });
  } catch (error) {
    console.error('Error updating meal:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    res
      .status(500)
      .json({ error: 'An error occurred while updating the meal' });
  }
};

// Delete a specific meal
const deleteMeal = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const deletedMeal = await Meal.findOneAndDelete({ _id: id, owner: userId });

    if (!deletedMeal) {
      return res
        .status(404)
        .json({ error: 'Meal not found or not authorized' });
    }

    res.status(200).json({
      message: 'Meal deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting meal:', error);
    res
      .status(500)
      .json({ error: 'An error occurred while deleting the meal' });
  }
};

module.exports = {
  createMeal,
  getMeals,
  getMeal,
  updateMeal,
  deleteMeal,
};
