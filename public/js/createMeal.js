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
      // Initialize with one recipe select
      addRecipeField();
    })
    .catch((err) => {
      console.error('Error fetching recipes:', err);
      // If there's an error, still add fields but with no options
      addRecipeField();
    });

  addRecipeButton.addEventListener('click', () => {
    addRecipeField();
  });

  function addRecipeField(existingRecipeId = null) {
    recipeCount++;
    const recipeDiv = document.createElement('div');
    recipeDiv.classList.add('recipe-item');

    // Create the select element
    const selectId = `recipeSelect${recipeCount}`;
    let optionsHtml = `<option value="">Select a recipe</option>`;
    allRecipes.forEach((recipe) => {
      optionsHtml += `<option value="${recipe._id}">${recipe.name}</option>`;
    });

    if (existingRecipeId) {
      optionsHtml += `<option value="${existingRecipeId}" selected hidden></option>`;
    }

    recipeDiv.innerHTML = `
        <label for="${selectId}">Recipe ${recipeCount}:</label>
        <select id="${selectId}" name="recipes" required aria-required="true">
          ${optionsHtml}
        </select>
        <button type="button" class="removeRecipeButton">Remove</button>
      `;

    recipesContainer.appendChild(recipeDiv);

    // Event listener to remove the recipe field
    recipeDiv
      .querySelector('.removeRecipeButton')
      .addEventListener('click', () => {
        recipesContainer.removeChild(recipeDiv);
      });
  }

  // Function to validate if a string is a valid ObjectId (24 hex characters)
  function isValidObjectId(id) {
    return /^[a-fA-F0-9]{24}$/.test(id);
  }

  // Handle form submission
  if (mealForm) {
    mealForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const formData = new FormData(mealForm);

      // Collect recipes
      const recipes = [];
      const recipeSelects = recipesContainer.querySelectorAll(
        'select[name="recipes"]'
      );
      let invalidRecipes = false;

      recipeSelects.forEach((select, index) => {
        const recipeId = select.value.trim();

        if (!recipeId || !isValidObjectId(recipeId)) {
          alert(`Recipe ${index + 1} is invalid or not selected correctly.`);
          invalidRecipes = true;
        } else {
          recipes.push(recipeId);
        }
      });

      if (invalidRecipes) {
        // Prevent form submission if any recipe is invalid
        return;
      }

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

      // Additional front-end validation
      if (!data.name) {
        alert('Please provide a name for the meal.');
        return;
      }
      if (isNaN(data.servings) || data.servings < 1) {
        alert('Please provide a valid number of servings.');
        return;
      }
      if (recipes.length === 0) {
        alert('Please add at least one valid recipe.');
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
