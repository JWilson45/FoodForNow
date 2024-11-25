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

    return strength;
  }

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
}
