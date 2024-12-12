const express = require('express');
const validate = require('../../middleware/validate');
const {
  addPantryIngredientValidationSchema,
  updatePantryIngredientValidationSchema,
  getPantryIngredientValidationSchema,
} = require('./validator');
const {
  addPantryIngredient,
  getPantryIngredients, // Import getPantryIngredients
  updatePantryIngredient,
  deletePantryIngredient,
} = require('../../services/pantry');

const pantryRouter = express.Router();

// Add a new ingredient to the pantry
pantryRouter.post(
  '/',
  validate(addPantryIngredientValidationSchema, 'body'),
  addPantryIngredient
);

// Get all pantry ingredients for the authenticated user
pantryRouter.get('/', getPantryIngredients);

// Update a pantry ingredient by ID
pantryRouter.put(
  '/:id',
  validate(getPantryIngredientValidationSchema, 'params'),
  validate(updatePantryIngredientValidationSchema, 'body'),
  updatePantryIngredient
);

// Delete a pantry ingredient by ID
pantryRouter.delete(
  '/:id',
  validate(getPantryIngredientValidationSchema, 'params'),
  deletePantryIngredient
);

module.exports = pantryRouter;