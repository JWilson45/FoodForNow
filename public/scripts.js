document.addEventListener('DOMContentLoaded', () => {
  // Easter egg button functionality
  const easterEgg = document.getElementById('easter-egg');
  if (easterEgg) {
    easterEgg.addEventListener('click', () => {
      window.open('https://www.youtube.com/watch?v=UWvs1JRhfdg', '_blank');
    });
  }

  // Password strength check for the signup page
  const signupForm = document.getElementById('signupForm');
  if (signupForm) {
    const passwordInput = signupForm.querySelector('#password');
    const progressBar = signupForm.querySelector('#progressBar');

    if (passwordInput && progressBar) {
      passwordInput.addEventListener('input', () => {
        const strength = getPasswordStrength(passwordInput.value);
        updateProgressBar(progressBar, strength);
      });
    }
  }

  // Function to determine password strength
  function getPasswordStrength(password) {
    let strength = 0;

    if (password.length >= 8) strength++; // Minimum length
    if (/[a-z]/.test(password)) strength++; // Lowercase letter
    if (/[A-Z]/.test(password)) strength++; // Uppercase letter
    if (/[0-9]/.test(password)) strength++; // Numeric digit
    if (/[^a-zA-Z0-9]/.test(password)) strength++; // Special character

    return strength;
  }

  // Function to update the progress bar
  function updateProgressBar(progressBar, strength) {
    const strengthLevels = ['weak', 'medium', 'strong', 'very-strong'];

    progressBar.className = `progress-bar ${strengthLevels[strength - 1] || ''}`;
    progressBar.style.width = `${(strength / 5) * 100}%`;

    if (strength === 5) {
      progressBar.textContent = 'Very Strong';
    } else if (strength === 4) {
      progressBar.textContent = 'Strong';
    } else if (strength === 3) {
      progressBar.textContent = 'Medium';
    } else if (strength > 0) {
      progressBar.textContent = 'Weak';
    } else {
      progressBar.textContent = '';
    }
  }

  // Signup form submission logic
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

document.addEventListener('DOMContentLoaded', () => {
  const showPasswordCheckbox = document.getElementById('showPassword');
  const passwordInput = document.getElementById('password');

  if (showPasswordCheckbox && passwordInput) {
    showPasswordCheckbox.addEventListener('change', () => {
      if (showPasswordCheckbox.checked) {
        passwordInput.type = 'text';
      } else {
        passwordInput.type = 'password';
      }
    });
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const headerPlaceholder = document.getElementById('header-placeholder');

  if (headerPlaceholder) {
    fetch('header.html')
      .then((response) => response.text())
      .then((html) => {
        headerPlaceholder.innerHTML = html;
      })
      .catch((error) => console.error('Error loading header:', error));
  }
});
