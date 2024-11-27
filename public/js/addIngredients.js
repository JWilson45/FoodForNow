export function initAddIngredient() {
  const ingredientForm = document.getElementById('ingredientForm');

  if (ingredientForm) {
    ingredientForm.addEventListener('submit', async (event) => {
      event.preventDefault(); // Prevent default form submission

      // Clear previous errors
      clearIngredientErrors();

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

      if (!data.name) {
        displayIngredientError('Please provide a name for the ingredient.');
        return;
      }

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
          if (errorData.errors && Array.isArray(errorData.errors)) {
            displayIngredientErrors(errorData.errors);
          } else {
            displayIngredientError(
              errorData.error ||
                'An error occurred while adding the ingredient.'
            );
          }
        }
      } catch (error) {
        console.error('Error adding ingredient:', error);
        displayIngredientError(
          'An unexpected error occurred. Please try again.'
        );
      }
    });
  }

  // Function to clear ingredient errors
  function clearIngredientErrors() {
    const errorContainer = document.querySelector('.ingredient-error-message');
    if (errorContainer) {
      errorContainer.remove();
    }
  }

  // Function to display a single ingredient error message
  function displayIngredientError(message) {
    clearIngredientErrors(); // Clear existing errors
    const errorMessage = document.createElement('div');
    errorMessage.classList.add('ingredient-error-message');
    errorMessage.style.color = 'red';
    errorMessage.style.marginTop = '10px';
    errorMessage.textContent = message;
    ingredientForm.appendChild(errorMessage);
  }

  // Function to display multiple field-specific errors
  function displayIngredientErrors(errors) {
    clearIngredientErrors(); // Clear existing errors
    const errorContainer = document.createElement('div');
    errorContainer.classList.add('ingredient-error-message');
    errorContainer.style.color = 'red';
    errorContainer.style.marginTop = '10px';

    errors.forEach((error) => {
      const errorItem = document.createElement('p');
      errorItem.textContent = `${error.field}: ${error.message}`;
      errorContainer.appendChild(errorItem);
    });

    ingredientForm.appendChild(errorContainer);
  }
}
