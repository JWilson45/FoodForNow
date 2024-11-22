const express = require('express'); // Import the Express framework
const ingredientRouter = require('./ingredient'); // Import the ingredient-related routes
const recipeRouter = require('./recipe'); // Import the recipe-related routes
const userRouter = require('./user'); // Import the user-related routes

const routes = express.Router(); // Create a new router instance

// Register sub-routers for specific resource paths
routes.use('/ingredients', ingredientRouter); // Routes for ingredient-related operations
routes.use('/recipes', recipeRouter); // Routes for recipe-related operations
routes.use('/users', userRouter); // Routes for user-related operations

module.exports = routes; // Export the router to be used in the main application
