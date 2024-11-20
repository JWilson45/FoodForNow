const express = require('express');

// Load environment variables
require('dotenv').config();


/*-------------------------------------
 *
 *            Import Routes
 *
 *------------------------------------*/
const userRouter = require('./routes/user_router');
const ingredientRouter = require('./routes/ingredient_router');
const mealRouter = require('./routes/meal_routes');
const recipeRouter = require('./routes/recipe_routes');
const connectDB = require('./services/database/database');

/*-------------------------------------
 *
 *          End Import Routes
 *
 *------------------------------------*/

const PORT = process.env.PORT || 8080;

const app = express();

// Middleware configuration
app.use(express.static('public'));
app.use(express.json());

// Register each route with the express app
app.use('/users', userRouter); // Example prefix
app.use('/ingredients', ingredientRouter);
app.use('/meals', mealRouter);
app.use('/recipes', recipeRouter);

// Start the HTTP server
app.listen(PORT, async () => {
  // await connectDB()
  console.log(`Server listening on port ${PORT}`);
});
