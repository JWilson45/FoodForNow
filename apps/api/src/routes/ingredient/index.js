// /apps/api/src/routes/ingredient/index.js

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
  barcodeLookupHandler,
  barcodeDecodeHandler,
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
// GET /ingredients/barcode/lookup?barcode=123456
ingredientRouter.get('/barcode/lookup', barcodeLookupHandler);

// POST /ingredients/barcode/decode
ingredientRouter.post('/barcode/decode', barcodeDecodeHandler);

// Fallback for all other routes
ingredientRouter.all('/', async (_, res) => {
  res.status(200).send('ingredients!');
});

module.exports = ingredientRouter;
