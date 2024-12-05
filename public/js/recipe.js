// recipe.js
export function initRecipe() {
  const recipeDetails = document.getElementById('recipeDetails');

  const params = new URLSearchParams(window.location.search);
  const recipeId = params.get('id');

  if (!recipeId) {
    recipeDetails.innerHTML = '<p>No recipe ID provided.</p>';
    return;
  }

  // Fetch the recipe data from the server
  fetch(`http://localhost:8080/api/recipes/${recipeId}`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Failed to fetch recipe');
      }
      return response.json();
    })
    .then((data) => {
      const recipe = data.recipe;

      if (!recipe) {
        recipeDetails.innerHTML = '<p>Recipe not found.</p>';
        return;
      }

      // Create the HTML structure for the recipe details
      recipeDetails.innerHTML = `
          <h2>${recipe.name}</h2>
          <p><strong>Description:</strong> ${recipe.description || 'No description provided.'}</p>
          <p><strong>Servings:</strong> ${recipe.servings}</p>
          <p><strong>Prep Time:</strong> ${recipe.prepTime} minutes</p>
          <p><strong>Cook Time:</strong> ${recipe.cookTime} minutes</p>
          <p><strong>Ingredients:</strong></p>
          <ul>
            ${recipe.ingredients
              .map(
                (ingredient) =>
                  `<li>${ingredient.amount} ${ingredient.unit} of Ingredient ID ${ingredient.ingredientId}</li>`
              )
              .join('')}
          </ul>
          <p><strong>Instructions:</strong></p>
          <ol>
            ${recipe.instructions.map((step) => `<li>${step}</li>`).join('')}
          </ol>
          <p><strong>Tags:</strong> ${recipe.tags.join(', ') || 'No tags provided.'}</p>
          <button id="backButton">Back to Cookbook</button>
        `;

      // Add event listener to the back button
      document.getElementById('backButton').addEventListener('click', () => {
        window.history.back();
      });
    })
    .catch((error) => {
      console.error('Error fetching recipe:', error);
      recipeDetails.innerHTML =
        '<p>Error fetching recipe. Please try again later.</p>';
    });
}
