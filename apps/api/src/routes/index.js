// src/routes/index.js

const express = require('express');
const ingredientRouter = require('./ingredient');
const recipeRouter = require('./recipe');
const userRouter = require('./user');
const mealRouter = require('./meal');
const pantryRouter = require('./pantry');

const authenticateUser = require('../middleware/authentication');

const routes = express.Router();

// Apply authentication middleware to protected routes
routes.use('/ingredients', authenticateUser, ingredientRouter);
routes.use('/recipes', authenticateUser, recipeRouter);
routes.use('/meals', authenticateUser, mealRouter);
routes.use('/users', userRouter); // Assuming user routes handle their own authentication
routes.use('/pantry', authenticateUser, pantryRouter); // Apply authentication here

module.exports = routes;