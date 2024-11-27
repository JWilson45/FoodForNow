// main.js

import { initLogin } from './login.js';
import { initSignup } from './signup.js';
import { initPasswordStrengthChecker } from './passwordStrength.js';
import { initTogglePassword } from './togglePassword.js';
import { loadHeader } from './loadHeader.js';
import { initEasterEgg } from './easterEgg.js';
import { initAddIngredient } from './addIngredients.js';

document.addEventListener('DOMContentLoaded', () => {
  loadHeader(); // Loads the header
  initEasterEgg(); // Initializes easter egg functionality
  initLogin(); // Initializes login form functionality
  initSignup(); // Initializes signup form functionality
  initPasswordStrengthChecker(); // Initializes password strength checker
  initTogglePassword(); // Initializes password toggle feature
  initAddIngredient(); // Initializes ingredient form functionality

  // Dynamically adjust form margin to prevent overlap with the header
  const header = document.querySelector('nav'); // Assuming <nav> is the header element
  const headerHeight = header ? header.offsetHeight : 0; // Get the height of the header
  const form = document.querySelector('form'); // Select the first form on the page
  if (form) {
    form.style.marginTop = `${headerHeight + 20}px`; // Add 20px margin below the header
  }
});
