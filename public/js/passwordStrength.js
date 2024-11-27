// passwordStrength.js

export function initPasswordStrengthChecker() {
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

  function getPasswordStrength(password) {
    let strength = 0;

    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    return Math.min(strength, 5); // Ensure strength does not exceed 5
  }

  function updateProgressBar(progressBar, strength) {
    const classes = ['weak', 'medium', 'strong', 'very-strong'];
    progressBar.className = 'progress-bar'; // Reset to base class
    progressBar.style.width = `${(strength / 5) * 100}%`;
    if (strength > 0 && strength <= 4) {
      progressBar.classList.add(classes[strength - 1]);
    } else if (strength === 5) {
      progressBar.classList.add('very-strong');
    }
  }
}
