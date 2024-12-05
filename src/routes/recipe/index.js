// Import the Express framework
const express = require('express');
const { createRecipe, getUserRecipes } = require('../../services/recipes');
const {
  createRecipeValidationSchema,
  getUserRecipesValidationSchema,
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

/**
 * Catch-all route for the base `/` path of this router.
 * Responds with a 200 status and a message indicating the recipes endpoint.
 */
recipeRouter.all('/', async (_, res) => {
  res.status(200).send('recipes!');
});

// Export the router to be used in the main application
module.exports = recipeRouter;
