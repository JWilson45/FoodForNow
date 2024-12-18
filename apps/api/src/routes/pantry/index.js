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
  updatePantryIngredient,
  deletePantryIngredient,
} = require('../../services/pantry');

const pantryRouter = express.Router();

// Add a new ingredient to a specified pantry (default pantry is 'Home')
pantryRouter.post(
  '/:pantryName/ingredients',
  validate(addPantryIngredientValidationSchema, 'body'),
  addPantryIngredient
);

// Get all ingredients from a specified pantry (default pantry is 'Home')
pantryRouter.get('/:pantryName/ingredients', getPantryIngredients);

// Update an ingredient in a specified pantry by ingredient ID
pantryRouter.put(
  '/:pantryName/ingredients/:id',
  validate(getPantryIngredientValidationSchema, 'params'),
  validate(updatePantryIngredientValidationSchema, 'body'),
  updatePantryIngredient
);

// Delete an ingredient from a specified pantry by ingredient ID
pantryRouter.delete(
  '/:pantryName/ingredients/:id',
  validate(getPantryIngredientValidationSchema, 'params'),
  deletePantryIngredient
);

module.exports = pantryRouter;