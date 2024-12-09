// src/services/pantry/index.js

const Pantry = require('../database/models/pantry'); // Adjust the path if necessary

/**
 * Adds a new ingredient to the pantry.
 */
const addPantryIngredient = async (req, res) => {
  try {
    const { name, quantity, unit } = req.body;
    const userId = req.user.userId; // Assuming authentication middleware populates req.user

    const newPantryItem = new Pantry({
      name,
      quantity,
      unit,
      userId,
    });

    await newPantryItem.save();

    res.status(201).json({
      message: 'Pantry item created successfully',
      pantryItem: newPantryItem,
    });
  } catch (error) {
    if (error.code === 11000) { // Duplicate key error
      return res.status(409).json({ error: 'Pantry item already exists' });
    }
    res.status(500).json({ error: 'Failed to add pantry ingredient' });
  }
};

/**
 * Retrieves all pantry ingredients for the authenticated user.
 */
const getPantryIngredients = async (req, res) => {
  try {
    const userId = req.user.id;
    const pantryItems = await Pantry.find({ userId });

    res.status(200).json({ pantryItems });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve pantry ingredients' });
  }
};

/**
 * Retrieves a single pantry ingredient by its ID.
 */
const getPantryIngredient = async (id) => {
  return await Pantry.findById(id);
};

/**
 * Updates a pantry ingredient by its ID.
 */
const updatePantryIngredient = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const userId = req.user.id;

    const updatedItem = await Pantry.findOneAndUpdate(
      { _id: id, userId },
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ error: 'Pantry item not found' });
    }

    res.status(200).json({
      message: 'Pantry item updated successfully',
      pantryItem: updatedItem,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update pantry ingredient' });
  }
};

/**
 * Deletes a pantry ingredient by its ID.
 */
const deletePantryIngredient = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const deletedItem = await Pantry.findOneAndDelete({ _id: id, userId });

    if (!deletedItem) {
      return res.status(404).json({ error: 'Pantry item not found' });
    }

    res.status(200).json({
      message: 'Pantry item deleted successfully',
      pantryItem: deletedItem,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete pantry ingredient' });
  }
};

module.exports = {
  addPantryIngredient,
  getPantryIngredients,
  getPantryIngredient,
  updatePantryIngredient,
  deletePantryIngredient,
};