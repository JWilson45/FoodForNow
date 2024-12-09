'use client';

import Head from 'next/head';
import { useState, useEffect } from 'react';

export default function Cookbook() {
  const [recipes, setRecipes] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetch('/api/recipes', { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => setRecipes(data.recipes || []))
      .catch((err) => console.error('Error fetching recipes:', err));
  }, []);

  const displayed = recipes.slice(currentIndex, currentIndex + 2);

  return (
    <>
      <Head>
        <title>My Cookbook</title>
      </Head>
      <main id="cookbook" className="container">
        <h2>My Cookbook</h2>
        <div id="recipeContainer" className="flex-container">
          {displayed.length === 0 ? (
            <p>No recipes found.</p>
          ) : (
            displayed.map((recipe) => (
              <div key={recipe._id} className="card">
                <h3>{recipe.name}</h3>
                <p>
                  <strong>Servings:</strong> {recipe.servings}
                </p>
                <p>
                  <strong>Prep Time:</strong> {recipe.prepTime} minutes
                </p>
                <p>
                  <strong>Cook Time:</strong> {recipe.cookTime} minutes
                </p>
                <p>
                  <strong>Ingredients:</strong>
                </p>
                <ul>
                  {recipe.ingredients.map((ing, i) => (
                    <li key={i}>
                      {ing.amount} {ing.unit} of Ingredient ID{' '}
                      {ing.ingredientId}
                    </li>
                  ))}
                </ul>
                <p>
                  <strong>Instructions:</strong>
                </p>
                <ol>
                  {recipe.instructions.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>
                <p>
                  <strong>Description:</strong>{' '}
                  {recipe.description || 'No description provided.'}
                </p>
                <button
                  onClick={() =>
                    (window.location.href = `recipe?id=${recipe._id}`)
                  }
                >
                  View Full Recipe
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
            disabled={currentIndex + 2 >= recipes.length}
          >
            Next
          </button>
        </div>
      </main>
    </>
  );
}
