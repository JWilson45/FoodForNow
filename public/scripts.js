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
          // Handle "User Already Exists" error
          else if (
            errorData.error === 'User Already Exists' &&
            errorData.keyPattern?.username
          ) {
            const usernameField = document.getElementById('username');
            if (usernameField) {
              usernameField.classList.add('error');
              let errorMessage = usernameField.nextElementSibling;
              if (
                !errorMessage ||
                !errorMessage.classList.contains('error-message')
              ) {
                errorMessage = document.createElement('div');
                errorMessage.classList.add('error-message');
                usernameField.parentNode.insertBefore(
                  errorMessage,
                  usernameField.nextSibling
                );
              }
              errorMessage.textContent =
                'This username is already taken. Please choose another.';
            }
          }
          // Handle unknown errors
          else {
            alert(`Signup failed: ${errorData.message || 'Unknown error'}`);
          }
        }
      } catch (error) {
        console.error('Error during signup:', error);
        alert('An error occurred. Please try again.');
      }
    });
  }

  // Function to display validation errors for specific fields
  function displayFieldErrors(errors) {
    errors.forEach((error) => {
      const field = document.getElementById(error.field);
      if (field) {
        // Add error styling to the field
        field.classList.add('error');
        // Show the error message below the field
        let errorMessage = field.nextElementSibling;
        if (
          !errorMessage ||
          !errorMessage.classList.contains('error-message')
        ) {
          errorMessage = document.createElement('div');
          errorMessage.classList.add('error-message');
          field.parentNode.insertBefore(errorMessage, field.nextSibling);
        }
        errorMessage.textContent = error.message;
      }
    });

    // Scroll to the first error field for visibility
    const firstErrorField = document.querySelector('.error');
    if (firstErrorField) {
      firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      firstErrorField.focus();
    }
  }
});
