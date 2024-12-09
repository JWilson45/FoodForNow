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
      .then((res) => res.json())
      .then((data) => {
        allRecipes = data.recipes || [];
        // Initialize with one recipe input field
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
    if (mealForm) {
      mealForm.addEventListener('submit', async (event) => {
        event.preventDefault();
  
        const formData = new FormData(mealForm);
  
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
           