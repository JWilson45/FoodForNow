// src/services/pantry/index.js

const Pantry = require('../database/models/pantry'); // Ensure this path is correct
const Ingredient = require('../database/models/ingredient'); // Ensure this path is correct

/**
 * Adds an ingredient to a specific pantry for the user.
 * If the pantry does not exist, it creates one.
 */
const addPantryIngredient = async (req, res) => {
  try {
    const { ingredientId, quantity, unit } = req.body;
    const userId = req.user.userId;
    const pantryName = req.params.pantryName || 'Home';

    const ingredientExists = await Ingredient.findById(ingredientId);
    if (!ingredientExists) {
      return res.status(404).json({ error: 'Ingredient not found.' });
    }

    // Find the user's pantry by userId and pantryName
    let pantry = await Pantry.findOne({ userId, pantryName });

    // If the pantry doesn't exist, create it
    if (!pantry) {
      pantry = new Pantry({
        userId,
        pantryName,
        ingredients: [{ ingredientId, quantity, unit }]
      });
      await pantry.save();
      return res.status(201).json({ message: 'Ingredient added.', pantry });
    }

    // If pantry exists, check if ingredient is already present
    const ingredientInPantry = pantry.ingredients.find(
      (item) => item.ingredientId.toString() === ingredientId
    );

    if (ingredientInPantry) {
      return res.status(409).json({ error: 'Ingredient already in pantry.' });
    }

    // Add new ingredient to the array
    pantry.ingredients.push({ ingredientId, quantity, unit });
    await pantry.save();

    res.status(201).json({ message: 'Ingredient added.', pantry });
  } catch (error) {
    console.error('Error adding pantry ingredient:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

/**
 * Retrieves all ingredients from a specific pantry for the user.
 */
const getPantryIngredients = async (req, res) => {
  try {
    const userId = req.user.userId;
    const pantryName = req.params.pantryName || 'Home';

    const pantry = await Pantry.findOne({ userId, pantryName })
      .populate('ingredients.ingredientId');
    if (!pantry) {
      return res.status(200).json({ ingredients: [] });
    }

    res.status(200).json({ ingredients: pantry.ingredients });
  } catch (error) {
    console.error('Error retrieving pantry ingredients:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

/**
 * Updates a pantry ingredient's quantity (and optionally unit).
 */
const updatePantryIngredient = async (req, res) => {
  try {
    const { id: ingredientId } = req.params;
    const { quantity, unit } = req.body;
    const userId = req.user.userId;
    const pantryName = req.params.pantryName || 'Home';

    // Build the update object
    const updateFields = { 'ingredients.$.quantity': quantity };
    if (unit !== undefined) {
      updateFields['ingredients.$.unit'] = unit;
    }

    const pantry = await Pantry.findOneAndUpdate(
      { userId, pantryName, 'ingredients.ingredientId': ingredientId },
      { $set: updateFields },
      { new: true }
    ).populate('ingredients.ingredientId');

    if (!pantry) {
      return res.status(404).json({ error: 'Pantry item not found.' });
    }

    res.status(200).json({ message: 'Pantry item updated.', pantry });
  } catch (error) {
    console.error('Error updating pantry ingredient:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

/**
 * Deletes a specific ingredient from a pantry.
 */
const deletePantryIngredient = async (req, res) => {
  try {
    const { id: ingredientId } = req.params;
    const userId = req.user.userId;
    const pantryName = req.params.pantryName || 'Home';

    const pantry = await Pantry.findOneAndUpdate(
      { userId, pantryName },
      { $pull: { ingredients: { ingredientId } } },
      { new: true }
    ).populate('ingredients.ingredientId');

    if (!pantry) {
      return res.status(404).json({ error: 'Pantry not found or no ingredient to delete.' });
    }

    res.status(200).json({ message: 'Ingredient removed from pantry.', pantry });
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