// viewMeals.js
export function initViewMeals() {
  const mealContainer = document.getElementById('mealContainer');
  const prevButton = document.getElementById('prevButton');
  const nextButton = document.getElementById('nextButton');

  let meals = []; // Array to hold fetched meals
  let currentIndex = 0; // Current index for pagination

  // Fetch meals on page load
  fetch('/api/meals', {
    method: 'GET',
    credentials: 'include', // Include auth cookie in the request
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Failed to fetch meals');
      }
      return response.json();
    })
    .then((data) => {
      meals = data.meals;
      console.log('Fetched Meals:', meals); // Debugging log
      if (meals.length === 0) {
        mealContainer.innerHTML = '<p>No meals found.</p>';
        prevButton.disabled = true;
        nextButton.disabled = true;
      } else {
        displayMeals();
      }
    })
    .catch((error) => {
      console.error('Error fetching meals:', error);
      mealContainer.innerHTML =
        '<p>Error fetching meals. Please try again later.</p>';
    });

  // Function to display meals two at a time
  function displayMeals() {
    mealContainer.innerHTML = ''; // Clear previous meals

    // Get the meals to display
    const mealsToDisplay = meals.slice(currentIndex, currentIndex + 2);
    console.log('Meals to Display:', mealsToDisplay); // Debugging log

    mealsToDisplay.forEach((meal) => {
      const mealCard = createMealCard(meal);
      mealContainer.appendChild(mealCard);
    });

    // Update button states
    prevButton.disabled = currentIndex === 0;
    nextButton.disabled = currentIndex + 2 >= meals.length;
  }

  // Function to create a meal card element
  function createMealCard(meal) {
    const card = document.createElement('div');
    card.classList.add('card');

    card.innerHTML = `
                <h3>${meal.name}</h3>
                <p><strong>Servings:</strong> ${meal.servings}</p>
                <p><strong>Calories:</strong> ${meal.calories || 'N/A'}</p>
                <p><strong>Meal Time:</strong> ${meal.mealTime || 'N/A'}</p>
                <p><strong>Cuisine:</strong> ${meal.cuisine || 'N/A'}</p>
                <p><strong>Tags:</strong> ${
                  meal.tags && meal.tags.length > 0
                    ? meal.tags.join(', ')
                    : 'None'
                }</p>
                <p><strong>Is Vegetarian:</strong> ${
                  meal.isVegetarian ? 'Yes' : 'No'
                }</p>
                <p><strong>Is Vegan:</strong> ${meal.isVegan ? 'Yes' : 'No'}</p>
                <p><strong>Description:</strong> ${
                  meal.description || 'No description provided.'
                }</p>
                <p><strong>Recipes:</strong></p>
                <ul>
                  ${meal.recipes
                    .map(
                      (recipe) =>
                        `<li>${recipe.name} (Prep Time: ${recipe.prepTime} mins, Cook Time: ${recipe.cookTime} mins)</li>`
                    )
                    .join('')}
                </ul>
                <button class="editMealButton" data-meal-id="${meal._id}">Edit Meal</button>
                <button class="deleteMealButton" data-meal-id="${meal._id}">Delete Meal</button>
              `;

    // Add event listener for "Edit Meal" button
    card.querySelector('.editMealButton').addEventListener('click', (event) => {
      const mealId = event.target.dataset.mealId;
      if (mealId && isValidObjectId(mealId)) {
        // Redirect to editMeal.html with the meal ID as a query parameter
        window.location.href = `editMeal.html?id=${mealId}`;
      } else {
        alert('Invalid Meal ID.');
      }
    });

    // Add event listener for "Delete Meal" button
    card
      .querySelector('.deleteMealButton')
      .addEventListener('click', async (event) => {
        const mealId = event.target.dataset.mealId;
        if (!mealId || !isValidObjectId(mealId)) {
          alert('Invalid Meal ID.');
          return;
        }
        const confirmDelete = confirm(
          'Are you sure you want to delete this meal?'
        );
        if (confirmDelete) {
          try {
            const response = await fetch(`/api/meals/${mealId}`, {
              method: 'DELETE',
              credentials: 'include',
              headers: {
                'Content-Type': 'application/json',
              },
            });

            if (response.ok) {
              alert('Meal deleted successfully!');
              // Remove the meal from the local array and refresh display
              meals = meals.filter((meal) => meal._id !== mealId);
              displayMeals();
            } else {
              const errorData = await response.json();
              alert(
                errorData.error || 'An error occurred while deleting the meal.'
              );
            }
          } catch (error) {
            console.error('Error deleting meal:', error);
            alert('An unexpected error occurred. Please try again.');
          }
        }
      });

    return card;
  }

  // Function to validate if a string is a valid ObjectId (24 hex characters)
  function isValidObjectId(id) {
    return /^[a-fA-F0-9]{24}$/.test(id);
  }

  // Event listeners for navigation buttons
  prevButton.addEventListener('click', () => {
    if (currentIndex >= 2) {
      currentIndex -= 2;
      displayMeals();
    }
  });

  nextButton.addEventListener('click', () => {
    if (currentIndex + 2 < meals.length) {
      currentIndex += 2;
      displayMeals();
    }
  });
}
