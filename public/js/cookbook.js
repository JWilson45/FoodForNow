// cookbook.js
export function initCookbook() {
  const recipeContainer = document.getElementById('recipeContainer');
  const prevButton = document.getElementById('prevButton');
  const nextButton = document.getElementById('nextButton');

  let recipes = []; // Array to hold fetched recipes
  let currentIndex = 0; // Current index for pagination

  // Fetch recipes on page load
  fetch('http://localhost:8080/api/recipes', {
    method: 'GET',
    credentials: 'include', // Include auth cookie in the request
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache', // Prevent caching
    },
    cache: 'no-store', // Additional cache control
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Failed to fetch recipes');
      }
      return response.json();
    })
    .then((data) => {
      recipes = data.recipes;
      if (recipes.length === 0) {
        recipeContainer.innerHTML = '<p>No recipes found.</p>';
        prevButton.disabled = true;
        nextButton.disabled = true;
      } else {
        displayRecipes();
      }
    })
    .catch((error) => {
      console.error('Error fetching recipes:', error);
      recipeContainer.innerHTML =
        '<p>Error fetching recipes. Please try again later.</p>';
    });

  // Function to display recipes two at a time
  function displayRecipes() {
    recipeContainer.innerHTML = ''; // Clear previous recipes

    // Get the recipes to display
    const recipesToDisplay = recipes.slice(currentIndex, currentIndex + 2);

    recipesToDisplay.forEach((recipe) => {
      const recipeCard = createRecipeCard(recipe);
      recipeContainer.appendChild(recipeCard);
    });

    // Update button states
    prevButton.disabled = currentIndex === 0;
    nextButton.disabled = currentIndex + 2 >= recipes.length;
  }

  // Function to create a recipe card element
  function createRecipeCard(recipe) {
    const card = document.createElement('div');
    card.classList.add('recipe-card');

    card.innerHTML = `
          <h3>${recipe.name}</h3>
          <p><strong>Cuisine:</strong> ${recipe.cuisine || 'N/A'}</p>
          <p><strong>Meal Time:</strong> ${recipe.mealTime || 'N/A'}</p>
          <p><strong>Servings:</strong> ${recipe.servings}</p>
          <p><strong>Prep Time:</strong> ${recipe.prepTime} minutes</p>
          <p><strong>Cook Time:</strong> ${recipe.cookTime} minutes</p>
          <p><strong>Total Time:</strong> ${recipe.totalTime} minutes</p>
          <p><strong>Description:</strong> ${recipe.description || 'No description provided.'}</p>
          <button class="viewRecipeButton" data-recipe-id="${recipe.id}">View Recipe</button>
        `;

    // Event listener for "View Recipe" button (you can implement this feature later)
    card
      .querySelector('.viewRecipeButton')
      .addEventListener('click', (event) => {
        const recipeId = event.target.dataset.recipeId;
        // Implement the logic to view the full recipe details
        alert(`Viewing recipe ID: ${recipeId}`);
      });

    return card;
  }

  // Event listeners for navigation buttons
  prevButton.addEventListener('click', () => {
    if (currentIndex >= 2) {
      currentIndex -= 2;
      displayRecipes();
    }
  });

  nextButton.addEventListener('click', () => {
    if (currentIndex + 2 < recipes.length) {
      currentIndex += 2;
      displayRecipes();
    }
  });
}
