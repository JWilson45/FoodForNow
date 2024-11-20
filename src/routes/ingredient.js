const express = require('express');

const ingredientRouter = express.Router();

ingredientRouter.all('/', async (_, res) => {
  res.status(200).send('ingredients!');
});

module.exports = ingredientRouter;
