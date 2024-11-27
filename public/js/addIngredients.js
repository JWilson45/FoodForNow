export function initAddIngredient() {
  const ingredientForm = document.getElementById('ingredientForm');
  const toggleButton = document.getElementById('toggleNutritionFacts');
  const nutritionFactsContent = document.getElementById(
    'nutritionFactsContent'
  );

  if (toggleButton && nutritionFactsContent) {
    toggleButton.addEventListener('click', () => {
      // Check the current state of the collapsible section
      const isExpanded = toggleButton.getAttribute('aria-expanded') === 'true';

      // Toggle the expanded state and content visibility
      toggleButton.setAttribute('aria-expanded', !isExpanded);
      nutritionFactsContent.style.display = isExpanded ? 'none' : 'block';

      // Update the button text
      toggleButton.textContent = isExpanded
        ? 'Nutritional Information ▼'
        : 'Nutritional Information ▲';
    });
  }

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
      };

      // Validate required fields
      if (!data.name) {
        displayIngredientError('Please provide a name for the ingredient.');
        return;
      }

      try {
        // Make the POST request to add the ingredient
        const response = await fetch('/api/ingredients', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        if (response.ok) {
          alert('Ingredient added successfully!');
          ingredientForm.reset(); // Clear the form on success
        } else {
          const errorData = await response.json();
          if (errorData.errors && Array.isArray(errorData.errors)) {
            // Display field-specific errors
            displayIngredientErrors(errorData.errors);
          } else {
            // Display a general error message
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

  // Clear any existing error messages
  function clearIngredientErrors() {
    const errorContainer = document.querySelector('.ingredient-error-message');
    if (errorContainer) {
      errorContainer.remove();
    }
  }

  // Display a single error message (e.g., general or global errors)
  function displayIngredientError(message) {
    clearIngredientErrors(); // Clear existing errors
    const errorMessage = document.createElement('div');
    errorMessage.classList.add('ingredient-error-message');
    errorMessage.style.color = 'red';
    errorMessage.style.marginTop = '10px';
    errorMessage.textContent = message;
    ingredientForm.appendChild(errorMessage);
  }

  // Display multiple field-specific errors
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
