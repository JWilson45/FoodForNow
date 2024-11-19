import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

/*-------------------------------------
 *
 *            Import Routes
 *
 *------------------------------------*/
import userRoutes from './routes/user_router';
import IngredientRoutes from './routes/ingredient_router';
import MealRoutes from './routes/meal_routes';
import RecipeRoutes from './routes/recipe_routes';

// Place routes into an iterable
const routes = [
  IngredientRoutes,
  userRoutes,
  MealRoutes,
  RecipeRoutes,
];

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
routes.forEach((route) => {
  route(app);
});

// Start the HTTP server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
