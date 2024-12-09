// main.js

// Import utility functions
import { loadHeader } from './loadHeader.js';
import { initEasterEgg } from './easterEgg.js';

// Import form-related initializers
import { initLogin } from './login.js';
import { initSignup } from './signup.js';
import { initPasswordStrengthChecker } from './passwordStrength.js';
import { initTogglePassword } from './togglePassword.js';
import { initAddIngredient } from './addIngredients.js';
import { initAddRecipe } from './addRecipe.js';
import { initCookbook } from './cookbook.js'; // Import the cookbook initializer
import { initRecipe } from './recipe.js'; // Import the recipe initializer
import { initCreateMeal } from './createMeal.js'; // Import the create meal initializer
import { initViewMeals } from './viewMeals.js'; // Import the view meals initializer
import { initEditMeal } from './editMeal.js'; // Import the edit meal initializer

// Initialize all components on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  // Load the header across all pages
  loadHeader();

  // Global functionality
  initEasterEgg();

  // Page-specific initializations
  if (document.getElementById('loginForm')) {
    initLogin();
    initTogglePassword(); // Call it here so login page also has the toggle password feature
  }

  if (document.getElementById('signupForm')) {
    initSignup();
    initPasswordStrengthChecker();
    initTogglePassword();
  }

  if (document.getElementById('ingredientForm')) {
    initAddIngredient();
  }

  if (document.getElementById('recipeForm')) {
    initAddRecipe();
  }

  if (document.getElementById('cookbook')) {
    initCookbook();
  }

  if (document.getElementById('recipeDetails')) {
    initRecipe();
  }

  if (document.getElementById('mealForm')) {
    initCreateMeal();
  }

  if (document.getElementById('meals')) {
    initViewMeals();
  }

  if (document.getElementById('editMealForm')) {
    initEditMeal();
  }

  // Dynamically adjust form margin to prevent overlap with the header
  const header = document.querySelector('nav');
  const headerHeight = header ? header.offsetHeight : 0;
  const form = document.querySelector('form');
  if (form) {
    form.style.marginTop = `${headerHeight + 20}px`;
  }
});
