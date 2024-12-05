// addRecipe.js
export function initAddRecipe() {
  const recipeForm = document.getElementById('recipeForm');
  const instructionsContainer = document.getElementById(
    'instructionsContainer'
  );
  const addInstructionButton = document.getElementById('addInstructionButton');
  const ingredientsContainer = document.getElementById('ingredientsContainer');
  const addIngredientButton = document.getElementById('addIngredientButton');

  let instructionCount = 0;
  let ingredientCount = 0;

  // Initialize with one instruction and one ingredient field
  addInstructionField();
  addIngredientField();

  // Event listener to add new instruction fields
  addInstructionButton.addEventListener('click', () => {
    addInstructionField();
  });

  // Event listener to add new ingredient fields
  addIngredientButton.addEventListener('click', () => {
    addIngredientField();
  });

  // Function to add a new instruction input field
  function addInstructionField() {
    instructionCount++;
    const instructionDiv = document.createElement('div');
    instructionDiv.classList.add('instruction-item');
    instructionDiv.innerHTML = `
        <label for="instruction${instructionCount}">Step ${instructionCount}:</label>
        <input
          type="text"
          id="instruction${instructionCount}"
          name="instructions"
          placeholder="Enter instruction"
          required
          aria-required="true"
        />
        <button type="button" class="removeInstructionButton">Remove</button>
      `;
    instructionsContainer.appendChild(instructionDiv);

    // Event listener to remove instruction fields
    instructionDiv
      .querySelector('.removeInstructionButton')
      .addEventListener('click', () => {
        instructionsContainer.removeChild(instructionDiv);
      });
  }

  // Function to add a new ingredient input group
  function addIngredientField() {
    ingredientCount++;
    const ingredientDiv = document.createElement('div');
    ingredientDiv.classList.add('ingredient-item');
    ingredientDiv.innerHTML = `
        <label for="ingredientId${ingredientCount}">Ingredient ${ingredientCount}:</label>
        <input
          type="text"
          id="ingredientId${ingredientCount}"
          name="ingredientIds"
          placeholder="Enter ingredient ID"
          required
          aria-required="true"
        />
        <label for="amount${ingredientCount}">Amount:</label>
        <input
          type="number"
          id="amount${ingredientCount}"
          name="amounts"
          placeholder="Enter amount"
          min="0"
          required
          aria-required="true"
        />
        <label for="unit${ingredientCount}">Unit:</label>
        <input
          type="text"
          id="unit${ingredientCount}"
          name="units"
          placeholder="Enter unit"
          required
          aria-required="true"
        />
        <label for="notes${ingredientCount}">Notes:</label>
        <input
          type="text"
          id="notes${ingredientCount}"
          name="notes"
          placeholder="Enter notes (optional)"
        />
        <button type="button" class="removeIngredientButton">Remove</button>
      `;
    ingredientsContainer.appendChild(ingredientDiv);

    // Event listener to remove ingredient fields
    ingredientDiv
      .querySelector('.removeIngredientButton')
      .addEventListener('click', () => {
        ingredientsContainer.removeChild(ingredientDiv);
      });
  }

  // Handle form submission
  if (recipeForm) {
    recipeForm.addEventListener('submit', async (event) => {
      event.preventDefault(); // Prevent default form submission

      // Collect form data
      const formData = new FormData(recipeForm);

      // Collect instructions
      const instructions = [];
      instructionsContainer
        .querySelectorAll('input[name="instructions"]')
        .forEach((input) => {
          instructions.push(input.value.trim());
        });

      // Collect ingredients
      const ingredients = [];
      const ingredientItems =
        ingredientsContainer.querySelectorAll('.ingredient-item');
      ingredientItems.forEach((item) => {
        const ingredientId = item
          .querySelector(`input[name="ingredientIds"]`)
          .value.trim();
        const amount = parseFloat(
          item.querySelector(`input[name="amounts"]`).value
        );
        const unit = item.querySelector(`input[name="units"]`).value.trim();
        const notes = item.querySelector(`input[name="notes"]`).value.trim();

        ingredients.push({
          ingredientId,
          amount,
          unit,
          notes: notes || undefined,
        });
      });

      // Build the data object
      const data = {
        name: formData.get('name').trim(),
        alias: formData.get('alias')?.trim() || undefined,
        description: formData.get('description')?.trim() || undefined,
        instructions,
        ingredients,
        servings: parseInt(formData.get('servings')),
        prepTime: parseInt(formData.get('prepTime')),
        cookTime: parseInt(formData.get('cookTime')),
        mealTime: formData.get('mealTime') || undefined,
        cuisine: formData.get('cuisine') || undefined,
        calories: formData.get('calories')
          ? parseFloat(formData.get('calories'))
          : undefined,
        tags: formData.get('tags')
          ? formData
              .get('tags')
              .split(',')
              .map((tag) => tag.trim())
          : undefined,
        isPublic: formData.get('isPublic') ? true : false,
        // You can include the owner ID here if necessary
        // owner: 'YOUR_OWNER_ID',
      };

      // Validate required fields
      if (!data.name) {
        alert('Please provide a name for the recipe.');
        return;
      }
      if (instructions.length === 0) {
        alert('Please provide at least one instruction.');
        return;
      }
      if (ingredients.length === 0) {
        alert('Please add at least one ingredient.');
        return;
      }

      try {
        // Make the POST request to add the recipe
        const response = await fetch('/api/recipes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        if (response.ok) {
          alert('Recipe created successfully!');
          recipeForm.reset(); // Clear the form on success
          // Reset dynamic fields
          instructionsContainer.innerHTML = '';
          ingredientsContainer.innerHTML = '';
          instructionCount = 0;
          ingredientCount = 0;
          addInstructionField();
          addIngredientField();
        } else {
          const errorData = await response.json();
          if (errorData.errors && Array.isArray(errorData.errors)) {
            // Display field-specific errors
            alert(
              errorData.errors
                .map((error) => `${error.field}: ${error.message}`)
                .join('\n')
            );
          } else {
            // Display a general error message
            alert(
              errorData.error || 'An error occurred while creating the recipe.'
            );
          }
        }
      } catch (error) {
        console.error('Error creating recipe:', error);
        alert('An unexpected error occurred. Please try again.');
      }
    });
  }
}
