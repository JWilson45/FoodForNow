const express = require('express');
const validate = require('../middleware/validate');
const {
  createIngredientValidationSchema,
  updateIngredientValidationSchema,
  getIngredientValidationSchema,
} = require('./validator');
const {
  createIngredient,
  getIngredients,
  updateIngredient,
  getIngredientById,
} = require('../../services/ingredients');

const ingredientRouter = express.Router();

// CREATE ingredient
ingredientRouter.post(
  '/',
  validate(createIngredientValidationSchema, 'body'),
  createIngredient
);

// GET all ingredients for authenticated users
ingredientRouter.get('/', getIngredients);

// GET ingredient by ID
ingredientRouter.get(
  '/:id',
  validate(getIngredientValidationSchema, 'params'),
  getIngredientById
);

// UPDATE ingredient by ID
ingredientRouter.put(
  '/:id',
  validate(getIngredientValidationSchema, 'params'),
  validate(updateIngredientValidationSchema, 'body'),
  updateIngredient
);

ingredientRouter.all('/', async (_, res) => {
  res.status(200).send('ingredients!');
});

module.exports = ingredientRouter;
