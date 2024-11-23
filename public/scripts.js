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
      console.log('Signup form submitted'); // Check if this logs in the browser console

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

        console.log('Response status:', response.status); // Log response status for debugging

        if (response.ok) {
          alert('Signup successful!');
          window.location.href = 'index.html';
        } else {
          const errorData = await response.json();
          alert(`Signup failed: ${errorData.message || 'Unknown error'}`);
        }
      } catch (error) {
        console.error('Error during signup:', error);
        alert('An error occurred. Please try again.');
      }
    });
  }
});
