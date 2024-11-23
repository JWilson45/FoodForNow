// togglePassword.js

export function initTogglePassword() {
  const togglePasswordVisibility = (checkboxId, passwordInputId) => {
    const checkbox = document.getElementById(checkboxId);
    const passwordInput = document.getElementById(passwordInputId);

    if (checkbox && passwordInput) {
      checkbox.addEventListener('change', () => {
        passwordInput.type = checkbox.checked ? 'text' : 'password';
      });
    }
  };

  // Apply the "Show Password" toggle for the login and signup pages
  togglePasswordVisibility('showPassword', 'password'); // Login page
  togglePasswordVisibility('showSignupPassword', 'password'); // Signup page
}
