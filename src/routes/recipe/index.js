// Import the Express framework
const express = require('express');

// Create a new router instance for handling recipe-related routes
const recipeRouter = express.Router();

/**
 * Catch-all route for the base `/` path of this router.
 * Responds with a 200 status and a message indicating the recipes endpoint.
 */
recipeRouter.all('/', async (_, res) => {
  res.status(200).send('recipes!');
});

// Export the router to be used in the main application
module.exports = recipeRouter;
