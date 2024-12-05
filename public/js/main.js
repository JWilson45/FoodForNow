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

document.addEventListener('DOMContentLoaded', () => {
  // Load the header across all pages
  loadHeader();

  // Global functionality
  initEasterEgg();

  // Page-specific initializations
  if (document.getElementById('loginForm')) {
    initLogin();
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

  // Dynamically adjust form margin to prevent overlap with the header
  const header = document.querySelector('nav'); // Assuming <nav> is the header element
  const headerHeight = header ? header.offsetHeight : 0; // Get the height of the header
  const form = document.querySelector('form'); // Select the first form on the page
  if (form) {
    form.style.marginTop = `${headerHeight + 20}px`; // Add 20px margin below the header
  }
});
