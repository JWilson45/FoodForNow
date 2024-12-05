// Import the Express framework
const express = require('express');

// Import the validation middleware
const validate = require('../../middleware/validate');

// Import the validation schema for ingredients
const { ingredientValidationSchema } = require('./validator');

// Import the service function to handle ingredient creation
const { createIngredient } = require('../../services/ingredients');

// Create a new router instance for handling ingredient-related routes
const ingredientRouter = express.Router();

/**
 * Route to handle ingredient creation.
 * - Validates the request body using the ingredientValidationSchema.
 * - Calls the createIngredient service function to process the request.
 */
ingredientRouter.post(
  '/', // Route path
  validate(ingredientValidationSchema), // Middleware to validate the request body
  createIngredient // Controller function to handle the logic
);

/**
 * Catch-all route for the base `/` path of this router.
 * Responds with a 200 status and a message indicating the ingredients endpoint.
 */
ingredientRouter.all('/', async (_, res) => {
  res.status(200).send('ingredients!');
});

// Export the router to be used in the main application
module.exports = ingredientRouter;
