function clearAllErrors() {
  // Remove all error messages
  const errorMessages = document.querySelectorAll('.error-message');
  errorMessages.forEach((msg) => msg.remove());

  // Remove error classes from fields
  const errorFields = document.querySelectorAll('.error');
  errorFields.forEach((field) => field.classList.remove('error'));
}

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
        name: formData.get('name')?.trim() || '',
        description: formData.get('description')?.trim() || undefined,
        calories: formData.get('calories')
          ? parseFloat(formData.get('calories'))
          : undefined,
        nutritionalInfo: {
          fat: formData.get('fat')
            ? parseFloat(formData.get('fat'))
            : undefined,
          protein: formData.get('protein')
            ? parseFloat(formData.get('protein'))
            : undefined,
          carbohydrates: formData.get('carbohydrates')
            ? parseFloat(formData.get('carbohydrates'))
            : undefined,
          fiber: formData.get('fiber')
            ? parseFloat(formData.get('fiber'))
            : undefined,
        },
        // Handle image if necessary
        // image: formData.get('image'), // This may need special handling
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
              `Failed to add ingredient: ${errorData.error || 'Unknown error'}`
            );
          }
        }
      } catch (error) {
        console.error('Error adding ingredient:', error);
        displayGlobalError('An error occurred. Please try again.');
      }
    });
  }

  // Helper function to clear previous errors
  function clearAllErrors() {
    // Remove all error messages
    const errorMessages = ingredientForm.querySelectorAll('.error-message');
    errorMessages.forEach((msg) => msg.remove());

    // Remove error classes from fields
    const errorFields = ingredientForm.querySelectorAll('.error');
    errorFields.forEach((field) => field.classList.remove('error'));
  }

  // Helper function to display field-specific errors
  function displayFieldErrors(errors) {
    errors.forEach((error) => {
      const fieldName = error.field;
      const message = error.message;

      const field = ingredientForm.querySelector(`[name="${fieldName}"]`);

      if (field) {
        field.classList.add('error');

        const errorMessage = document.createElement('div');
        errorMessage.classList.add('error-message');
        errorMessage.textContent = message;
        field.parentNode.insertBefore(errorMessage, field.nextSibling);
      }
    });
  }

  // Helper function to display global errors
  function displayGlobalError(message) {
    const globalErrorContainer = document.createElement('div');
    globalErrorContainer.classList.add('global-error');
    globalErrorContainer.textContent = message;
    ingredientForm.prepend(globalErrorContainer);
  }
}
