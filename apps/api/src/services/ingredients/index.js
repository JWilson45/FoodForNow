// /apps/api/src/services/ingredients/index.js

const Ingredient = require('../database/models/ingredient');

// Create a new ingredient
const createIngredient = async (req, res) => {
  try {
    const { name, description, calories, image, nutritionalInfo } = req.body;

    const newIngredient = new Ingredient({
      name,
      description,
      calories,
      image,
      nutritionalInfo,
      createdBy: req.user.userId,
    });

    await newIngredient.save();

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
    if (error.code === 11000) {
      return res.status(409).json({
        error: 'Ingredient already exists',
        keyPattern: error.keyPattern,
      });
    }

    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }

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

    res.status(200).json({ ingredients });
  } catch (error) {
    console.error('Error fetching ingredients:', error);
    res.status(500).json({
      error: 'An error occurred while fetching the ingredients',
    });
  }
};

// Get a single ingredient by ID (no ownership enforced)
const getIngredientById = async (req, res) => {
  try {
    const { id } = req.params;

    const ingredient = await Ingredient.findById(id);
    if (!ingredient) {
      return res.status(404).json({ error: 'Ingredient not found' });
    }

    res.status(200).json({ ingredient });
  } catch (error) {
    console.error('Error fetching ingredient:', error);
    res
      .status(500)
      .json({ error: 'An error occurred while fetching the ingredient' });
  }
};

// Update an ingredient (no ownership enforced)
const updateIngredient = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedIngredient = await Ingredient.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedIngredient) {
      return res.status(404).json({ error: 'Ingredient not found' });
    }

    res.status(200).json({
      message: 'Ingredient updated successfully',
      ingredient: updatedIngredient,
    });
  } catch (error) {
    console.error('Error updating ingredient:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    res
      .status(500)
      .json({ error: 'An error occurred while updating the ingredient' });
  }
};

module.exports = {
  createIngredient,
  getIngredients,
  getIngredientById,
  updateIngredient,
};
