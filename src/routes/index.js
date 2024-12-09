// src/routes/index.js

const express = require('express');
const ingredientRouter = require('./ingredient');
const recipeRouter = require('./recipe');
const userRouter = require('./user');
const mealRouter = require('./meal');
const authenticateUser = require('../middleware/authentication');

const routes = express.Router();

routes.use('/ingredients', authenticateUser, ingredientRouter);
routes.use('/recipes', authenticateUser, recipeRouter);
routes.use('/meals', authenticateUser, mealRouter);
routes.use('/users', userRouter);

module.exports = routes;
