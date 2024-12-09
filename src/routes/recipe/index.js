// Import the Express framework
const express = require('express');
const {
  createRecipe,
  getUserRecipes,
  getRecipe,
} = require('../../services/recipes');
const {
  createRecipeValidationSchema,
  getUserRecipesValidationSchema,
  getRecipeValidationSchema,
} = require('./validator');
const validate = require('../../middleware/validate');

// Create a new router instance for handling recipe-related routes
const recipeRouter = express.Router();

// GET route to fetch recipes for a specific user (validates params if provided)
// recipeRouter.get(
//   '/user/:userId',
//   validate(getUserRecipesValidationSchema, 'params'),
//   getSpecificUserRecipes
// );

recipeRouter.get(
  '/',
  validate(getUserRecipesValidationSchema, 'params'),
  getUserRecipes
);

// POST route to create a new recipe (validates the body)
recipeRouter.post(
  '/',
  validate(createRecipeValidationSchema, 'body'),
  createRecipe
);

// New route for fetching a single recipe by ID (via query param)
recipeRouter.get(
  '/:id',
  validate(getRecipeValidationSchema, 'params'), // Validate query params
  getRecipe
);

// Catch-all route for the base '/'
recipeRouter.all('/', async (_, res) => {
  res.status(200).send('recipes!');
});

module.exports = recipeRouter;
