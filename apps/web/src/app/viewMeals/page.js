'use client';

import Head from 'next/head';
import { useState, useEffect } from 'react';

export default function ViewMeals() {
  const [meals, setMeals] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetch('/api/meals', { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => setMeals(data.meals || []))
      .catch((err) => console.error('Error fetching meals:', err));
  }, []);

  const displayedMeals = meals.slice(currentIndex, currentIndex + 2);

  return (
    <>
      <Head>
        <title>My Meals</title>
      </Head>
      <main id="meals" className="container">
        <h2>My Meals</h2>
        <div id="mealContainer" className="flex-container">
          {displayedMeals.length === 0 ? (
            <p>No meals found.</p>
          ) : (
            displayedMeals.map((meal) => (
              <div key={meal._id} className="card">
                <h3>{meal.name}</h3>
                <p>
                  <strong>Servings:</strong> {meal.servings}
                </p>
                <p>
                  <strong>Calories:</strong> {meal.calories || 'N/A'}
                </p>
                <p>
                  <strong>Meal Time:</strong> {meal.mealTime || 'N/A'}
                </p>
                <p>
                  <strong>Cuisine:</strong> {meal.cuisine || 'N/A'}
                </p>
                <p>
                  <strong>Tags:</strong> {meal.tags?.join(', ') || 'None'}
                </p>
                <p>
                  <strong>Is Vegetarian:</strong>{' '}
                  {meal.isVegetarian ? 'Yes' : 'No'}
                </p>
                <p>
                  <strong>Is Vegan:</strong> {meal.isVegan ? 'Yes' : 'No'}
                </p>
                <p>
                  <strong>Description:</strong>{' '}
                  {meal.description || 'No description provided.'}
                </p>
                <p>
                  <strong>Recipes:</strong>
                </p>
                <ul>
                  {meal.recipes.map((recipe) => (
                    <li key={recipe._id}>
                      {recipe.name} (Prep: {recipe.prepTime} mins, Cook:{' '}
                      {recipe.cookTime} mins)
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() =>
                    (window.location.href = `editMeal?id=${meal._id}`)
                  }
                >
                  Edit Meal
                </button>
                <button
                  onClick={async () => {
                    if (confirm('Are you sure you want to delete this meal?')) {
                      const res = await fetch(`/api/meals/${meal._id}`, {
                        method: 'DELETE',
                        credentials: 'include',
                      });
                      if (res.ok) {
                        alert('Meal deleted successfully!');
                        setMeals((prev) =>
                          prev.filter((m) => m._id !== meal._id)
                        );
                      } else {
                        const errData = await res.json();
                        alert(errData.error || 'Error deleting meal.');
                      }
                    }
                  }}
                >
                  Delete Meal
                </button>
              </div>
            ))
          )}
        </div>
        <div id="navigationButtons" className="flex-container">
          <button
            onClick={() => setCurrentIndex((i) => Math.max(i - 2, 0))}
            disabled={currentIndex === 0}
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentIndex((i) => i + 2)}
            disabled={currentIndex + 2 >= meals.length}
          >
            Next
          </button>
        </div>
      </main>
    </>
  );
}
