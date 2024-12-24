const express = require('express');
const validate = require('../../middleware/validate');
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
  handleBarcodeLookup,
  handleBarcodeDecode,
} = require('../../services/ingredients');

const ingredientRouter = express.Router();

// CREATE ingredient
ingredientRouter.post(
  '/',
  validate(createIngredientValidationSchema, 'body'),
  createIngredient
);

// GET all ingredients
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

// Barcode-related routes
ingredientRouter.get('/barcode/lookup', handleBarcodeLookup);
ingredientRouter.post('/barcode/decode', handleBarcodeDecode);

module.exports = ingredientRouter;
