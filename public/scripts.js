document.addEventListener('DOMContentLoaded', () => {
  // Easter egg button functionality
  const easterEgg = document.getElementById('easter-egg');
  if (easterEgg) {
    easterEgg.addEventListener('click', () => {
      window.open('https://www.youtube.com/watch?v=UWvs1JRhfdg', '_blank');
    });
  }

  // Password strength check
  const passwordInput = document.getElementById('password');
  const progressBar = document.getElementById('progressBar');

  if (passwordInput && progressBar) {
    passwordInput.addEventListener('input', function () {
      const strength = getPasswordStrength(passwordInput.value);
      updateProgressBar(strength);
    });
  }

  // Form submission handler
  const form = document.getElementById('loginForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault(); // Prevent default form submission

      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;

      if (username && password) {
        alert('Login successful!');
      } else {
        alert('Please fill out all fields.');
      }
    });
  }

  // Signup Form Submission
  const signupForm = document.getElementById('signupForm');

  if (signupForm) {
    signupForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      // Clear previous errors
      clearAllErrors();

      const formData = {
        firstName: document.getElementById('firstName').value.trim(),
        username: document.getElementById('username').value.trim(),
        password: document.getElementById('password').value,
        email: document.getElementById('email').value.trim(),
      };

      try {
        const response = await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          alert('Signup successful!');
          window.location.href = 'index.html';
        } else {
          const errorData = await response.json();

          // Handle validation errors
          if (errorData.errors && Array.isArray(errorData.errors)) {
            displayFieldErrors(errorData.errors);
          }
          // Handle "User Already Exists" or unique constraint errors
          else if (errorData.error && errorData.keyPattern) {
            displayUniqueConstraintError(errorData.keyPattern);
          }
          // Handle unknown errors
          else {
            displayGlobalError(
              `Signup failed: ${errorData.message || 'Unknown error'}`
            );
          }
        }
      } catch (error) {
        console.error('Error during signup:', error);
        displayGlobalError('An error occurred. Please try again.');
      }
    });
  }

  // Clear all errors from the form
  function clearAllErrors() {
    document.querySelectorAll('.error').forEach((field) => {
      field.classList.remove('error');
    });

    document.querySelectorAll('.error-message').forEach((errorMessage) => {
      errorMessage.remove();
    });
  }

  // Display field-specific validation errors
  function displayFieldErrors(errors) {
    errors.forEach((error) => {
      const field = document.getElementById(error.field);
      if (field) {
        field.classList.add('error'); // Add error styling
        showErrorBelowField(field, error.message);
      }
    });

    focusFirstError();
  }

  // Display unique constraint errors (e.g., "User Already Exists")
  function displayUniqueConstraintError(keyPattern) {
    Object.keys(keyPattern).forEach((fieldKey) => {
      const field = document.getElementById(fieldKey);
      if (field) {
        field.classList.add('error'); // Add error styling

        // Determine the specific error message for the field
        const errorMessage =
          fieldKey === 'username'
            ? 'This username is already in use. Please choose another.'
            : fieldKey === 'email'
              ? 'This email is already in use. Please choose another.'
              : `This ${fieldKey} is already in use. Please choose another.`;

        showErrorBelowField(field, errorMessage);
      }
    });

    focusFirstError();
  }

  // Display global error message
  function displayGlobalError(message) {
    const form = document.getElementById('signupForm');
    const globalError = document.createElement('div');
    globalError.classList.add('error-message', 'global-error');
    globalError.textContent = message;
    form.insertBefore(globalError, form.firstChild);
  }

  // Show an error message below a specific field
  function showErrorBelowField(field, message) {
    let errorMessage = field.nextElementSibling;
    if (!errorMessage || !errorMessage.classList.contains('error-message')) {
      errorMessage = document.createElement('div');
      errorMessage.classList.add('error-message');
      field.parentNode.insertBefore(errorMessage, field.nextSibling);
    }
    errorMessage.textContent = message;
  }

  // Focus on the first field with an error
  function focusFirstError() {
    const firstErrorField = document.querySelector('.error');
    if (firstErrorField) {
      firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      firstErrorField.focus();
    }
  }
});
