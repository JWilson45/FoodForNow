const express = require('express');
const { test, getRecipe } = require('../controllers/recipe'); // Adjust the path as needed

const recipeRouter = express.Router();

// Define your routes
recipeRouter.get('/test', test);

recipeRouter.get('/recipe', getRecipe);

// Export the router
module.exports = recipeRouter;
