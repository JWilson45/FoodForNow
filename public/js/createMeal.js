// createMeal.js
export function initCreateMeal() {
  const mealForm = document.getElementById('mealForm');
  const recipesContainer = document.getElementById('recipesContainer');
  const addRecipeButton = document.getElementById('addRecipeButton');

  let recipeCount = 0;
  let allRecipes = []; // Store fetched recipes here

  // Fetch recipes on page load
  fetch('/api/recipes', {
    method: 'GET',
    credentials: 'include', // Include auth cookie in the request
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error('Failed to fetch recipes');
      }
      return res.json();
    })
    .then((data) => {
      allRecipes = data.recipes || [];
      // Initialize with one recipe field
      addRecipeField();
    })
    .catch((err) => {
      console.error('Error fetching recipes:', err);
      // If there's an error, still add fields but without dropdown functionality
      addRecipeField();
    });

  addRecipeButton.addEventListener('click', () => {
    addRecipeField();
  });

  function addRecipeField() {
    recipeCount++;
    const recipeDiv = document.createElement('div');
    recipeDiv.classList.add('recipe-item');

    // Create a unique datalist id
    const datalistId = `recipesDatalist${recipeCount}`;

    // Construct the datalist options from the fetched recipes
    let optionsHtml = allRecipes
      .map(
        (recipe) =>
          `<option data-id="${recipe.id}" value="${recipe.name}"></option>`
      )
      .join('');

    recipeDiv.innerHTML = `
        <label for="recipeName${recipeCount}">Recipe ${recipeCount}:</label>
        <input
          type="text"
          id="recipeName${recipeCount}"
          name="recipeNames"
          placeholder="Start typing recipe name..."
          list="${datalistId}"
          required
          aria-required="true"
        />
        <datalist id="${datalistId}">
          ${optionsHtml}
        </datalist>
  
        <!-- Hidden field to store the recipe ID after selection -->
        <input type="hidden" name="recipeIds" id="recipeIdHidden${recipeCount}" />
  
        <button type="button" class="removeRecipeButton">Remove</button>
      `;

    recipesContainer.appendChild(recipeDiv);

    // Event listener to remove the recipe field
    recipeDiv
      .querySelector('.removeRecipeButton')
      .addEventListener('click', () => {
        recipesContainer.removeChild(recipeDiv);
      });

    // Attach an event to update hidden ID when the user picks a recipe
    const recipeNameInput = recipeDiv.querySelector(
      `input[name="recipeNames"]`
    );
    recipeNameInput.addEventListener('input', () => {
      const val = recipeNameInput.value.toLowerCase();
      const matchedRecipe = allRecipes.find(
        (rec) => rec.name.toLowerCase() === val
      );
      const hiddenIdField = recipeDiv.querySelector(
        `#recipeIdHidden${recipeCount}`
      );
      if (matchedRecipe) {
        hiddenIdField.value = matchedRecipe.id;
      } else {
        hiddenIdField.value = '';
      }
    });
  }

  // Handle form submission
  if (mealForm) {
    mealForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const formData = new FormData(mealForm);

      // Collect recipes
      const recipes = [];
      const recipeItems = recipesContainer.querySelectorAll('.recipe-item');
      recipeItems.forEach((item) => {
        const recipeId = item
          .querySelector(`input[name="recipeIds"]`)
          .value.trim();
        if (recipeId) {
          recipes.push(recipeId);
        }
      });

      const data = {
        name: formData.get('name').trim(),
        description: formData.get('description')?.trim() || undefined,
        recipes,
        mealTime: formData.get('mealTime') || undefined,
        servings: parseInt(formData.get('servings')),
        calories: formData.get('calories')
          ? parseFloat(formData.get('calories'))
          : undefined,
        tags: formData.get('tags')
          ? formData
              .get('tags')
              .split(',')
              .map((tag) => tag.trim())
          : undefined,
        isVegetarian: formData.get('isVegetarian') ? true : false,
        isVegan: formData.get('isVegan') ? true : false,
        cuisine: formData.get('cuisine') || undefined,
      };

      // Validate required fields
      if (!data.name) {
        alert('Please provide a name for the meal.');
        return;
      }
      if (data.servings < 1 || isNaN(data.servings)) {
        alert('Please provide a valid number of servings.');
        return;
      }
      if (recipes.length === 0) {
        alert('Please add at least one recipe.');
        return;
      }

      try {
        const response = await fetch('/api/meals', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        if (response.ok) {
          alert('Meal created successfully!');
          mealForm.reset();
          recipesContainer.innerHTML = '';
          recipeCount = 0;
          addRecipeField();
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
              errorData.error || 'An error occurred while creating the meal.'
            );
          }
        }
      } catch (error) {
        console.error('Error creating meal:', error);
        alert('An unexpected error occurred. Please try again.');
      }
    });
  }
}
