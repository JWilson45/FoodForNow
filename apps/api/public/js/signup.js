// signup.js

export function initSignup() {
  const signupForm = document.getElementById('signupForm');

  if (signupForm) {
    signupForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      // Clear previous errors
      clearAllErrors();

      const formData = {
        firstName: document.getElementById('firstName').value.trim(),
        lastName: document.getElementById('lastName').value.trim(),
        username: document.getElementById('username').value.trim(),
        password: document.getElementById('password').value,
        email: document.getElementById('email').value.trim(),
        dateOfBirth: document.getElementById('dateOfBirth').value.trim(),
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
          } else if (errorData.error && errorData.keyPattern) {
            displayUniqueConstraintError(errorData.keyPattern);
          } else {
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

  // Helper functions (clearAllErrors, displayFieldErrors, etc.) go here
  function clearAllErrors() {
    document.querySelectorAll('.error').forEach((field) => {
      field.classList.remove('error');
    });

    document.querySelectorAll('.error-message').forEach((errorMessage) => {
      errorMessage.remove();
    });
  }

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

  function displayUniqueConstraintError(keyPattern) {
    Object.keys(keyPattern).forEach((fieldKey) => {
      const field = document.getElementById(fieldKey);
      if (field) {
        field.classList.add('error'); // Add error styling

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

  function displayGlobalError(message) {
    const form = document.getElementById('signupForm');
    const globalError = document.createElement('div');
    globalError.classList.add('error-message', 'global-error');
    globalError.textContent = message;
    form.insertBefore(globalError, form.firstChild);
  }

  function showErrorBelowField(field, message) {
    let errorMessage = field.nextElementSibling;
    if (!errorMessage || !errorMessage.classList.contains('error-message')) {
      errorMessage = document.createElement('div');
      errorMessage.classList.add('error-message');
      field.parentNode.insertBefore(errorMessage, field.nextSibling);
    }
    errorMessage.textContent = message;
  }

  function focusFirstError() {
    const firstErrorField = document.querySelector('.error');
    if (firstErrorField) {
      firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      firstErrorField.focus();
    }
  }
}
