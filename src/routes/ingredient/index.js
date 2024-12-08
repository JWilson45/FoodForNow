const express = require('express');
const validate = require('../../middleware/validate');
const { createIngredientValidationSchema } = require('./validator');
const {
  createIngredient,
  getIngredients,
} = require('../../services/ingredients');

// Create a new router instance for handling ingredient-related routes
const ingredientRouter = express.Router();

/**
 * Route to handle ingredient creation.
 * - Validates the request body using the ingredientValidationSchema.
 * - Calls the createIngredient service function to process the request.
 */
ingredientRouter.post(
  '/', // Route path
  validate(createIngredientValidationSchema), // Middleware to validate the request body
  createIngredient // Controller function to handle the logic
);

ingredientRouter.get('/', getIngredients);

/**
 * Catch-all route for the base `/` path of this router.
 * Responds with a 200 status and a message indicating the ingredients endpoint.
 */
ingredientRouter.all('/', async (_, res) => {
  res.status(200).send('ingredients!');
});

// Export the router to be used in the main application
module.exports = ingredientRouter;
