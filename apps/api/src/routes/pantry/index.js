const express = require('express');
const validate = require('../../middleware/validate');
const {
  createPantryValidationSchema,
  addPantryIngredientValidationSchema,
  updatePantryIngredientValidationSchema,
  getPantryIngredientValidationSchema,
} = require('./validator');
const {
  createPantry,
  addPantryIngredient,
  getPantryIngredients,
  updatePantryIngredient,
  deletePantryIngredient,
} = require('../../services/pantry');

const pantryRouter = express.Router();

// Create a new pantry
pantryRouter.post('/', validate(createPantryValidationSchema, 'body'), createPantry);

// Add an ingredient to a pantry
pantryRouter.post('/:pantryName/ingredients', validate(addPantryIngredientValidationSchema, 'body'), addPantryIngredient);

// Get all ingredients from a pantry
pantryRouter.get('/:pantryName/ingredients', getPantryIngredients);

// Update an ingredient in a pantry
pantryRouter.put(
  '/:pantryName/ingredients/:id',
  validate(getPantryIngredientValidationSchema, 'params'),
  validate(updatePantryIngredientValidationSchema, 'body'),
  updatePantryIngredient
);

// Delete an ingredient from a pantry
pantryRouter.delete(
  '/:pantryName/ingredients/:id',
  validate(getPantryIngredientValidationSchema, 'params'),
  deletePantryIngredient
);

// Catch-all route for debugging
pantryRouter.use((req, res) => {
  res.status(404).json({
    error: 'Pantry route not found',
    path: req.originalUrl,
    method: req.method,
  });
});

module.exports = pantryRouter;