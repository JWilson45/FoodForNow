export function initAddIngredient() {
  const ingredientForm = document.getElementById('ingredientForm');

  if (ingredientForm) {
    ingredientForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      // Clear previous errors
      clearAllErrors();

      // Collect form data
      const formData = new FormData(ingredientForm);
      const data = {
        name: formData.get('name').trim(),
        description: formData.get('description').trim(),
        calories: parseFloat(formData.get('calories')) || 0,
        nutritionalInfo: {
          fat: parseFloat(formData.get('nutritionalInfo.fat')) || 0,
          protein: parseFloat(formData.get('nutritionalInfo.protein')) || 0,
          carbohydrates:
            parseFloat(formData.get('nutritionalInfo.carbohydrates')) || 0,
          fiber: parseFloat(formData.get('nutritionalInfo.fiber')) || 0,
        },
        image: formData.get('image'), // Optional: handle image separately if needed
      };

      try {
        const response = await fetch('/api/ingredients', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        if (response.ok) {
          alert('Ingredient added successfully!');
          ingredientForm.reset();
        } else {
          const errorData = await response.json();

          // Handle validation errors
          if (errorData.errors && Array.isArray(errorData.errors)) {
            displayFieldErrors(errorData.errors);
          } else {
            displayGlobalError(
              `Failed to add ingredient: ${errorData.message || 'Unknown error'}`
            );
          }
        }
      } catch (error) {
        console.error('Error adding ingredient:', error);
        displayGlobalError('An error occurred. Please try again.');
      }
    });
  }

  // Helper functions
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

  function displayGlobalError(message) {
    const form = document.getElementById('ingredientForm');
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
