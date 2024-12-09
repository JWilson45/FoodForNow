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
  let allIngredients = []; // Store fetched ingredients here

  // Fetch ingredients on page load
  fetch('/api/ingredients')
    .then((res) => res.json())
    .then((data) => {
      allIngredients = data.ingredients || [];
      // Initialize fields only after we have ingredients
      addInstructionField();
      addIngredientField(allIngredients);
    })
    .catch((err) => {
      console.error('Error fetching ingredients:', err);
      // If there's an error, still add fields but without dropdown functionality
      addInstructionField();
      addIngredientField([]);
    });

  addInstructionButton.addEventListener('click', () => {
    addInstructionField();
  });

  addIngredientButton.addEventListener('click', () => {
    addIngredientField(allIngredients);
  });

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

    instructionDiv
      .querySelector('.removeInstructionButton')
      .addEventListener('click', () => {
        instructionsContainer.removeChild(instructionDiv);
      });
  }

  function addIngredientField(ingredientList) {
    ingredientCount++;
    const ingredientDiv = document.createElement('div');
    ingredientDiv.classList.add('ingredient-item');

    // Create a unique datalist id
    const datalistId = `ingredientsDatalist${ingredientCount}`;

    // Construct the datalist options from the fetched ingredients
    let optionsHtml = ingredientList
      .map(
        (ing) => `<option data-id="${ing._id}" value="${ing.name}"></option>`
      )
      .join('');

    ingredientDiv.innerHTML = `
      <label for="ingredientName${ingredientCount}">Ingredient ${ingredientCount}:</label>
      <input
        type="text"
        id="ingredientName${ingredientCount}"
        name="ingredientNames"
        placeholder="Start typing ingredient name..."
        list="${datalistId}"
        required
        aria-required="true"
      />
      <datalist id="${datalistId}">
        ${optionsHtml}
      </datalist>

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

      <!-- Hidden field to store the ingredient ID after selection -->
      <input type="hidden" name="ingredientIds" id="ingredientIdHidden${ingredientCount}" />

      <button type="button" class="removeIngredientButton">Remove</button>
    `;

    ingredientsContainer.appendChild(ingredientDiv);

    // Event listener to remove the ingredient field
    ingredientDiv
      .querySelector('.removeIngredientButton')
      .addEventListener('click', () => {
        ingredientsContainer.removeChild(ingredientDiv);
      });

    // Attach an event to update hidden ID when the user picks an ingredient
    const ingredientNameInput = ingredientDiv.querySelector(
      `#ingredientName${ingredientCount}`
    );
    ingredientNameInput.addEventListener('input', () => {
      const val = ingredientNameInput.value.toLowerCase();
      const matchedIngredient = allIngredients.find(
        (ing) => ing.name.toLowerCase() === val
      );
      const hiddenIdField = ingredientDiv.querySelector(
        `#ingredientIdHidden${ingredientCount}`
      );
      if (matchedIngredient) {
        hiddenIdField.value = matchedIngredient._id;
      } else {
        hiddenIdField.value = '';
      }
    });
  }

  // Handle form submission
  if (recipeForm) {
    recipeForm.addEventListener('submit', async (event) => {
      event.preventDefault();

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

        if (!ingredientId) {
          // If no ingredientId matched, show an alert or handle error
          alert('One or more ingredients are not selected from the list.');
          return;
        }

        ingredients.push({
          ingredientId,
          amount,
          unit,
          notes: notes || undefined,
        });
      });

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
        const response = await fetch('/api/recipes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        if (response.ok) {
          alert('Recipe created successfully!');
          recipeForm.reset();
          instructionsContainer.innerHTML = '';
          ingredientsContainer.innerHTML = '';
          instructionCount = 0;
          ingredientCount = 0;
          addInstructionField();
          addIngredientField(allIngredients);
        } else {
          const errorData = await response.json();
          if (errorData.errors && Array.isArray(errorData.errors)) {
            alert(
              errorData.errors
                .map((error) => `${error.field}: ${error.message}`)
                .join('\n')
            );
          } else {
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
