// src/services/pantry/index.js

const Pantry = require('../database/models/pantry'); // Ensure this path is correct
const Ingredient = require('../database/models/ingredient'); // Ensure this path is correct

/**
 * Adds an ingredient to the pantry.
 */
const addPantryIngredient = async (req, res) => {
  try {
    const { ingredientId, quantity } = req.body;
    const userId = req.user.userId; // Assuming authentication middleware populates req.user

    // Validate existence of the ingredient
    const ingredientExists = await Ingredient.findById(ingredientId);
    if (!ingredientExists) {
      return res.status(404).json({ error: 'Ingredient not found.' });
    }

    // Check if the ingredient already exists in the user's pantry
    const existingPantryItem = await Pantry.findOne({ userId, ingredientId });
    if (existingPantryItem) {
      return res.status(409).json({ error: 'Ingredient already exists in pantry.' });
    }

    // Create and save a new pantry item
    const newPantryItem = new Pantry({ userId, ingredientId, quantity });
    await newPantryItem.save();

    res.status(201).json({
      message: 'Ingredient added to pantry successfully.',
      pantryItem: newPantryItem,
    });
  } catch (error) {
    console.error('Error adding pantry ingredient:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

/**
 * Retrieves all pantry ingredients for the authenticated user.
 */
const getPantryIngredients = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Retrieve and populate ingredient details
    const pantryItems = await Pantry.find({ userId }).populate('ingredientId');

    res.status(200).json({ pantryItems });
  } catch (error) {
    console.error('Error retrieving pantry ingredients:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

/**
 * Updates a pantry ingredient by its ID.
 */
const updatePantryIngredient = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    const userId = req.user.userId;

    // Update the pantry item
    const updatedItem = await Pantry.findOneAndUpdate(
      { _id: id, userId },
      { quantity },
      { new: true, runValidators: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ error: 'Pantry item not found.' });
    }

    res.status(200).json({
      message: 'Pantry item updated successfully.',
      pantryItem: updatedItem,
    });
  } catch (error) {
    console.error('Error updating pantry ingredient:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

/**
 * Deletes a pantry ingredient by its ID.
 */
const deletePantryIngredient = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    // Delete the pantry item
    const deletedItem = await Pantry.findOneAndDelete({ _id: id, userId });

    if (!deletedItem) {
      return res.status(404).json({ error: 'Pantry item not found.' });
    }

    res.status(200).json({
      message: 'Pantry item deleted successfully.',
      pantryItem: deletedItem,
    });
  } catch (error) {
    console.error('Error deleting pantry ingredient:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

module.exports = {
  addPantryIngredient,
  getPantryIngredients,
  updatePantryIngredient,
  deletePantryIngredient,
};