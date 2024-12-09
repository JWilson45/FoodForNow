// src/routes/pantry/index.js

const express = require('express');
const validate = require('../../middleware/validate');
const {
  addPantryIngredientValidationSchema,
  updatePantryIngredientValidationSchema,
  getPantryIngredientValidationSchema,
} = require('./validator');
const {
  addPantryIngredient,
  getPantryIngredients,
  getPantryIngredient,
  updatePantryIngredient,
  deletePantryIngredient,
} = require('../../services/pantry');

const pantryRouter = express.Router();

// Middleware to log incoming request bodies (for debugging)
pantryRouter.use((req, res, next) => {
  console.log('Incoming Request Body:', req.body);
  next();
});

/**
 * @route   POST /api/pantry
 * @desc    Add a new ingredient to the pantry
 * @access  Protected
 */
pantryRouter.post(
  '/',
  validate(addPantryIngredientValidationSchema, 'body'),
  addPantryIngredient
);

/**
 * @route   GET /api/pantry
 * @desc    Get all pantry ingredients for the authenticated user
 * @access  Protected
 */
pantryRouter.get('/', getPantryIngredients);

/**
 * @route   GET /api/pantry/:id
 * @desc    Get a single pantry ingredient by ID
 * @access  Protected
 */
pantryRouter.get(
  '/:id',
  validate(getPantryIngredientValidationSchema, 'params'),
  async (req, res, next) => {
    try {
      const ingredient = await getPantryIngredient(req.params.id);
      if (ingredient) {
        res.status(200).json(ingredient);
      } else {
        res.status(404).json({ message: 'Ingredient not found' });
      }
    } catch (error) {
      console.error('Error fetching pantry ingredient:', error);
      next(error);
    }
  }
);

/**
 * @route   PUT /api/pantry/:id
 * @desc    Update a pantry ingredient by ID
 * @access  Protected
 */
pantryRouter.put(
  '/:id',
  validate(getPantryIngredientValidationSchema, 'params'),
  validate(updatePantryIngredientValidationSchema, 'body'),
  updatePantryIngredient
);

/**
 * @route   DELETE /api/pantry/:id
 * @desc    Delete a pantry ingredient by ID
 * @access  Protected
 */
pantryRouter.delete(
  '/:id',
  validate(getPantryIngredientValidationSchema, 'params'),
  deletePantryIngredient
);

module.exports = pantryRouter;