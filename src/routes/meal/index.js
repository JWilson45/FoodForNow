// src/routes/meal/index.js

const express = require('express');
const validate = require('../../middleware/validate');
const {
  createMeal,
  getMeals,
  getMeal,
  updateMeal,
  deleteMeal,
} = require('../../services/meals');
const {
  createMealValidationSchema,
  updateMealValidationSchema,
  getMealValidationSchema,
} = require('./validator');

const mealRouter = express.Router();

// POST /meals - Create a new meal
mealRouter.post('/', validate(createMealValidationSchema, 'body'), createMeal);

// GET /meals - Get all meals for the authenticated user
mealRouter.get('/', getMeals);

// GET /meals/:id - Get a single meal by ID
mealRouter.get('/:id', validate(getMealValidationSchema, 'params'), getMeal);

// PUT /meals/:id - Update a meal
mealRouter.put(
  '/:id',
  validate(getMealValidationSchema, 'params'),
  validate(updateMealValidationSchema, 'body'),
  updateMeal
);

// DELETE /meals/:id - Delete a meal
mealRouter.delete(
  '/:id',
  validate(getMealValidationSchema, 'params'),
  deleteMeal
);

// Catch-all route for `/meals`
mealRouter.all('/', (_, res) => {
  res.status(200).send('meals!');
});

module.exports = mealRouter;
