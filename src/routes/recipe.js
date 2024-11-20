const express = require('express');

const recipeRouter = express.Router();

recipeRouter.all('/', async (_, res) => {
  res.status(200).send('recipes!');
});

module.exports = recipeRouter;
