// main.js

import { initLogin } from './login.js';
import { initSignup } from './signup.js';
import { initPasswordStrengthChecker } from './passwordStrength.js';
import { initTogglePassword } from './togglePassword.js';
import { loadHeader } from './loadHeader.js';
import { initEasterEgg } from './easterEgg.js';

document.addEventListener('DOMContentLoaded', () => {
  loadHeader();
  initEasterEgg();
  initLogin();
  initSignup();
  initPasswordStrengthChecker();
  initTogglePassword();
});
