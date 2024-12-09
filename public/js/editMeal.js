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
      credentials: 'include', // Include auth cookie in the request
      headers: {
        'Content-Type': 'application/json',
      },
    }),
    fetch('/api/recipes', {
      method: 'GET',
      credentials: 'include', // Include auth cookie in the request
      headers: {
        'Content-Type': 'application/json',
      },
    }),
  ])
    .then(async ([mealRes, recipesRes]) => {
      if (!mealRes.ok) {
        if (mealRes.status === 401) {
          throw new Error('Authentication required');
        }
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
      if (err.message === 'Authentication required') {
        alert('You must be logged in to edit a meal.');
        window.location.href = 'login.html'; // Ensure this page exists
      } else {
        alert('Error fetching meal details. Redirecting to meals page.');
        window.location.href = 'viewMeals.html';
      }
    });

  function populateForm(meal) {
    console.log('Populating form with meal:', meal); // Debugging log

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
        addRecipeField(recipe._id); // Use '_id' instead of 'id'
      });
    } else {
      addRecipeField();
    }
  }

  addRecipeButton.addEventListener('click', () => {
    addRecipeField();
  });

  function addRecipeField(existingRecipeId = null) {
    recipeCount++;
    const recipeDiv = document.createElement('div');
    recipeDiv.classList.add('recipe-item');

    // Create a unique datalist id
    const datalistId = `recipesDatalist${recipeCount}`;

    // Construct the datalist options from the fetched recipes
    let optionsHtml = allRecipes
      .map(
        (recipe) =>
          `<option data-id="${recipe._id}" value="${recipe.name}"></option>`
      )
      .join('');

    // If there's an existing recipe ID (in edit mode), find the corresponding name
    let existingRecipeName = '';
    if (existingRecipeId) {
      const existingRecipe = allRecipes.find(
        (recipe) => recipe._id === existingRecipeId
      );
      existingRecipeName = existingRecipe ? existingRecipe.name : '';
    }

    recipeDiv.innerHTML = `
            <label for="recipeName${recipeCount}">Recipe ${recipeCount}:</label>
            <input
              type="text"
              id="recipeName${recipeCount}"
              name="recipeNames"
              list="${datalistId}"
              placeholder="Start typing recipe name..."
              required
              aria-required="true"
              value="${existingRecipeName}"
            />
            <datalist id="${datalistId}">
              ${optionsHtml}
            </datalist>
            
            <input type="hidden" name="recipeIds" id="recipeIdHidden${recipeCount}" value="${existingRecipeId || ''}" />
  
            <button type="button" class="removeRecipeButton">Remove</button>
          `;

    recipesContainer.appendChild(recipeDiv);

    // Event listener to remove the recipe field
    recipeDiv
      .querySelector('.removeRecipeButton')
      .addEventListener('click', () => {
        recipesContainer.removeChild(recipeDiv);
      });

    // Event listener to capture the selected recipe ID
    const recipeNameInput = recipeDiv.querySelector(
      `#recipeName${recipeCount}`
    );
    const hiddenIdField = recipeDiv.querySelector(
      `#recipeIdHidden${recipeCount}`
    );

    recipeNameInput.addEventListener('input', () => {
      const val = recipeNameInput.value.trim().toLowerCase();
      const matchedRecipe = allRecipes.find(
        (recipe) => recipe.name.toLowerCase() === val
      );
      if (matchedRecipe) {
        hiddenIdField.value = matchedRecipe._id; // Use '_id'
      } else {
        hiddenIdField.value = '';
      }
    });
  }

  // Function to validate if a string is a valid ObjectId (24 hex characters)
  function isValidObjectId(id) {
    return /^[a-fA-F0-9]{24}$/.test(id);
  }

  // Handle form submission
  if (editMealForm) {
    editMealForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const formData = new FormData(editMealForm);

      // Collect recipes
      const recipes = [];
      const recipeIdFields = recipesContainer.querySelectorAll(
        'input[name="recipeIds"]'
      );

      let invalidRecipes = false;

      recipeIdFields.forEach((hiddenInput, index) => {
        const recipeId = hiddenInput.value.trim();

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

      // Validate required fields
      if (!data.name) {
        alert('Please provide a name for the meal.');
        return;
      }
      if (isNaN(data.servings) || data.servings < 1) {
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
          credentials: 'include', // Include auth cookie in the request
        });

        if (response.ok) {
          alert('Meal updated successfully!');
          window.location.href = 'viewMeals.html';
        } else if (response.status === 401) {
          alert('You must be logged in to edit a meal.');
          window.location.href = 'login.html'; // Ensure this page exists
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
