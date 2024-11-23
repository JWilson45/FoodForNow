// login.js

export function initLogin() {
  const loginForm = document.getElementById('loginForm');

  if (loginForm) {
    loginForm.addEventListener('submit', async (event) => {
      event.preventDefault(); // Prevent default form submission

      // Clear previous errors
      clearLoginErrors();

      // Get form values
      const username = document.getElementById('username').value.trim();
      const password = document.getElementById('password').value;

      // Basic field validation
      if (!username || !password) {
        displayLoginError('Please fill in both username and password.');
        return;
      }

      try {
        // Make the login request
        const response = await fetch('api/users/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
          const data = await response.json();
          alert('Login successful!');
          console.log('User data:', data);

          // Redirect to homepage or dashboard
          window.location.href = '/';
        } else {
          const errorData = await response.json();
          displayLoginError(errorData.error || 'Invalid username or password.');
        }
      } catch (error) {
        console.error('Error during login:', error);
        displayLoginError('An unexpected error occurred. Please try again.');
      }
    });
  }

  // Function to clear login errors
  function clearLoginErrors() {
    const errorContainer = document.querySelector('.login-error-message');
    if (errorContainer) {
      errorContainer.remove();
    }
  }

  // Function to display login error messages
  function displayLoginError(message) {
    clearLoginErrors(); // Clear existing errors
    const errorMessage = document.createElement('div');
    errorMessage.classList.add('login-error-message');
    errorMessage.style.color = 'red';
    errorMessage.style.marginTop = '10px';
    errorMessage.textContent = message;
    loginForm.appendChild(errorMessage);
  }
}
