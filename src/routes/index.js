const express = require('express');
const ingredientRouter = require('./ingredient');
const recipeRouter = require('./recipe');
const userRouter = require('./user');

const routes = express.Router();

routes.use('/ingredients', ingredientRouter);
routes.use('/recipes', recipeRouter);
routes.use('/users', userRouter);

module.exports = routes;
