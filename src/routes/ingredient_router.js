const express = require('express');
const { getIngredient } = require('../controllers/ingredient'); // Adjust the path as needed

const ingredientRouter = express.Router();

// Define your routes
ingredientRouter.get('/ingredients', getIngredient);
// ingredientRouter.post('/ingredients', createIngredient); // Uncomment if needed

// Export the router
module.exports = ingredientRouter;
