const express = require('express');
const { getMeal, test } = require('../controllers/meal'); // Adjust the path as needed

const mealRouter = express.Router();

// Define your routes
mealRouter.get('/test', test);
mealRouter.get('/meal', getMeal);

// Export the router
module.exports = mealRouter;
