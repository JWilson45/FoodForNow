const express = require('express');
const ingredientRouter = require('./ingredient');
const recipeRouter = require('./recipe');
const userRouter = require('./user');
const mealRouter = require('./meal');
const pantryRouter = require('./pantry');

const authenticateUser = require('../middleware/authentication');

const routes = express.Router();

// Debugging middleware to log all incoming API requests
routes.use((req, res, next) => {
  console.log(`Incoming API request: ${req.method} ${req.originalUrl}`);
  next();
});

// Apply authentication middleware to protected routes
routes.use('/ingredients', authenticateUser, ingredientRouter);
routes.use('/recipes', authenticateUser, recipeRouter);
routes.use('/meals', authenticateUser, mealRouter);
routes.use('/users', userRouter); // Ensure userRouter is mapped correctly
routes.use('/pantry', authenticateUser, pantryRouter);

module.exports = routes;