// editMeal.js
export function initEditMeal() {
  const editMealForm = document.getElementById('editMealForm');
  const recipesContainer = document.getElementById('recipesContainer');
  const addRecipeButton = document.getElementById('addRecipeButton');

  let recipeCount = 0;
  let allRecipes = []; // Store fetched recipes here
  let mealId = null;

  // Extract meal ID from URL query parameters
  const urlParams = new URLSearchParams(window.location.search);
  mealId = urlParams.get('id');

  if (!mealId) {
    alert('No meal ID provided.');
    window.location.href = 'viewMeals.html';
    return;
  }

  // Fetch meal details and recipes on page load
  Promise.all([
    fetch(`/api/meals/${mealId}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    }),
    fetch('/api/recipes', {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    }),
  ])
    .then(async ([mealRes, recipesRes]) => {
      if (!mealRes.ok) {
        throw new Error('Failed to fetch meal details');
      }
      if (!recipesRes.ok) {
        throw new Error('Failed to fetch recipes');
      }
      const mealData = await mealRes.json();
      const recipesData = await recipesRes.json();
      return { meal: mealData.meal, recipes: recipesData.recipes };
    })
    .then(({ meal, recipes }) => {
      allRecipes = recipes || [];
      populateForm(meal);
    })
    .catch((err) => {
      console.error('Error fetching data:', err);
      alert('Error fetching meal details. Redirecting to meals page.');
      window.location.href = 'viewMeals.html';
    });

  function populateForm(meal) {
    // Populate basic fields
    document.getElementById('mealName').value = meal.name;
    document.getElementById('mealDescription').value = meal.description || '';
    document.getElementById('mealServings').value = meal.servings;
    document.getElementById('mealCalories').value = meal.calories || '';
    document.getElementById('mealMealTime').value = meal.mealTime || '';
    document.getElementById('mealCuisine').value = meal.cuisine || '';
    document.getElementById('mealTags').value = meal.tags
      ? meal.tags.join(', ')
      : '';
    document.getElementById('mealIsVegetarian').checked = meal.isVegetarian;
    document.getElementById('mealIsVegan').checked = meal.isVegan;

    // Populate recipes
    if (meal.recipes && meal.recipes.length > 0) {
      meal.recipes.forEach((recipe) => {
        addRecipeField(recipe);
      });
    } else {
      addRecipeField();
    }
  }

  addRecipeButton.addEventListener('click', () => {
    addRecipeField();
  });

  function addRecipeField(existingRecipe = null) {
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

    const selectedRecipe = existingRecipe
      ? allRecipes.find((rec) => rec.id === existingRecipe.id)
      : null;

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
          value="${selectedRecipe ? selectedRecipe.name : ''}"
        />
        <datalist id="${datalistId}">
          ${optionsHtml}
        </datalist>
  
        <!-- Hidden field to store the recipe ID after selection -->
        <input type="hidden" name="recipeIds" id="recipeIdHidden${recipeCount}" value="${selectedRecipe ? selectedRecipe.id : ''}" />
  
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
  if (editMealForm) {
    editMealForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const formData = new FormData(editMealForm);

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
        const response = await fetch(`/api/meals/${mealId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        if (response.ok) {
          alert('Meal updated successfully!');
          window.location.href = 'viewMeals.html';
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
              errorData.error || 'An error occurred while updating the meal.'
            );
          }
        }
      } catch (error) {
        console.error('Error updating meal:', error);
        alert('An unexpected error occurred. Please try again.');
      }
    });
  }
}
