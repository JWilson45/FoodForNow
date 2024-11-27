const express = require('express');
const validate = require('../../middleware/validate');
const { ingredientValidationSchema } = require('./validator');
const { createIngredient } = require('../../services/ingredients');

const ingredientRouter = express.Router();

ingredientRouter.post(
  '/',
  validate(ingredientValidationSchema),
  createIngredient
);

ingredientRouter.all('/', async (_, res) => {
  res.status(200).send('ingredients!');
});

module.exports = ingredientRouter;
