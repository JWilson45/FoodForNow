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

mealRouter.post('/', validate(createMealValidationSchema, 'body'), createMeal);
mealRouter.get('/', getMeals);
mealRouter.get('/:id', validate(getMealValidationSchema, 'params'), getMeal);
mealRouter.put(
  '/:id',
  validate(getMealValidationSchema, 'params'),
  validate(updateMealValidationSchema, 'body'),
  updateMeal
);
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
