const express = require('express');
const {
  createRecipe,
  getUserRecipes,
  getRecipe,
  updateRecipe,
  deleteRecipe,
} = require('../../services/recipes');
const {
  createRecipeValidationSchema,
  getRecipeValidationSchema,
  updateRecipeValidationSchema,
} = require('./validator');
const validate = require('../../middleware/validate');

const recipeRouter = express.Router();

// GET all recipes for authenticated user (no validation needed for this GET)
recipeRouter.get('/', getUserRecipes);

// CREATE recipe
recipeRouter.post(
  '/',
  validate(createRecipeValidationSchema, 'body'),
  createRecipe
);

// GET recipe by ID
recipeRouter.get(
  '/:id',
  validate(getRecipeValidationSchema, 'params'),
  getRecipe
);

// UPDATE recipe by ID
recipeRouter.put(
  '/:id',
  validate(getRecipeValidationSchema, 'params'),
  validate(updateRecipeValidationSchema, 'body'),
  updateRecipe
);

// DELETE recipe by ID
recipeRouter.delete(
  '/:id',
  validate(getRecipeValidationSchema, 'params'),
  deleteRecipe
);

// Catch-all
recipeRouter.all('/', async (_, res) => {
  res.status(200).send('recipes!');
});

module.exports = recipeRouter;
