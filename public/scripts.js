// Easter egg button functionality
document.getElementById('easter-egg').addEventListener('click', () => {
  window.open('https://www.youtube.com/watch?v=UWvs1JRhfdg', '_blank');
});

// Password strength check
const passwordInput = document.getElementById('password');
const progressBar = document.getElementById('progressBar');

passwordInput.addEventListener('input', function () {
  const strength = getPasswordStrength(passwordInput.value);
  updateProgressBar(strength);
});

// Calculate password strength
function getPasswordStrength(password) {
  let strength = 0;
  const regexes = [
    /[a-z]/, // lowercase
    /[A-Z]/, // uppercase
    /[0-9]/, // number
    /[!@#$%^&*(),.?":{}|<>]/, // special character
    /.{8,}/, // length >= 8
  ];

  regexes.forEach((regex) => {
    if (regex.test(password)) {
      strength++;
    }
  });

  return strength;
}

// Update the progress bar based on password strength
function updateProgressBar(strength) {
  const width = (strength / 5) * 100;
  progressBar.style.width = width + '%';

  // Change color based on strength
  if (width < 40) {
    progressBar.style.backgroundColor = 'red';
  } else if (width < 70) {
    progressBar.style.backgroundColor = 'orange';
  } else {
    progressBar.style.backgroundColor = 'green';
  }
}

// Form submission handler
const form = document.getElementById('loginForm');
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
