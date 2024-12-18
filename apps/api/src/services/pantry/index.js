const Pantry = require('../database/models/pantry');
const Ingredient = require('../database/models/ingredient');

/**
 * Creates a new pantry for the user.
 */
const createPantry = async (req, res) => {
  try {
    const { pantryName = 'Home' } = req.body; // Default to "Home" if not provided
    const userId = req.user.userId;

    if (!pantryName) {
      return res.status(400).json({ error: 'Pantry name cannot be null or empty.' });
    }

    // Check for duplicate pantry
    const existingPantry = await Pantry.findOne({ userId, pantryName });
    if (existingPantry) {
      return res.status(409).json({ error: 'A pantry with this name already exists.' });
    }

    // Create the pantry
    const pantry = new Pantry({
      userId,
      pantryName,
      ingredients: [],
    });
    await pantry.save();

    res.status(201).json({ message: 'Pantry created successfully.', pantry });
  } catch (error) {
    if (error.code === 11000) {
      console.error('Duplicate pantry creation error:', error);
      return res.status(409).json({ error: 'Duplicate pantry name detected for this user.' });
    }
    console.error('Error creating pantry:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

/**
 * Adds an ingredient to a specific pantry for the user.
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

    let pantry = await Pantry.findOne({ userId, pantryName });

    if (!pantry) {
      pantry = new Pantry({
        userId,
        pantryName,
        ingredients: [{ ingredientId, quantity, unit }],
      });
      await pantry.save();
    } else {
      const ingredientInPantry = pantry.ingredients.find(
        (item) => item.ingredientId.toString() === ingredientId
      );

      if (ingredientInPantry) {
        return res.status(409).json({ error: 'Ingredient already in pantry.' });
      }

      pantry.ingredients.push({ ingredientId, quantity, unit });
      await pantry.save();
    }

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

    const pantry = await Pantry.findOne({ userId, pantryName }).populate('ingredients.ingredientId');
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
 * Updates a pantry ingredient's quantity and unit.
 */
const updatePantryIngredient = async (req, res) => {
  try {
    const { id: ingredientId } = req.params;
    const { quantity, unit } = req.body;
    const userId = req.user.userId;
    const pantryName = req.params.pantryName || 'Home';

    const updateFields = { 'ingredients.$.quantity': quantity };
    if (unit !== undefined) updateFields['ingredients.$.unit'] = unit;

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
  createPantry,
  addPantryIngredient,
  getPantryIngredients,
  updatePantryIngredient,
  deletePantryIngredient,
};