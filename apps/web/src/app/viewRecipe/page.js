// /app/viewRecipe/page.js
'use client';

import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import config from '@/config'; // Import the config

export default function RecipePage() {
  const [recipe, setRecipe] = useState(null);
  const searchParams = useSearchParams();
  const id = searchParams.get('id'); // Retrieve the query parameter

  useEffect(() => {
    if (!id) return;
    fetch(`${config.apiBaseUrl}/recipes/${id}`, { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => setRecipe(data.recipe || null))
      .catch((err) => console.error('Error fetching recipe:', err));
  }, [id]);

  return (
    <>
      <Head>
        <title>Recipe Details</title>
      </Head>
      <main className="container mx-auto p-6 bg-gray-900 min-h-screen">
        {!recipe ? (
          <p className="text-gray-300">Loading or no recipe found.</p>
        ) : (
          <div className="bg-black/80 border-2 border-button-blue rounded-xl p-6 shadow-custom animate-fadeIn">
            <h2 className="text-3xl font-bold mb-4 text-white">
              {recipe.name}
            </h2>
            <p className="text-gray-300 mb-2">
              <strong>Description:</strong>{' '}
              {recipe.description || 'No description provided.'}
            </p>
            <p className="text-gray-300 mb-2">
              <strong>Servings:</strong> {recipe.servings}
            </p>
            <p className="text-gray-300 mb-2">
              <strong>Prep Time:</strong> {recipe.prepTime} minutes
            </p>
            <p className="text-gray-300 mb-2">
              <strong>Cook Time:</strong> {recipe.cookTime} minutes
            </p>
            <div className="mb-4">
              <strong className="text-gray-300">Ingredients:</strong>
              <ul className="list-disc list-inside text-gray-300">
                {recipe.ingredients.map((ing, i) => (
                  <li key={i}>
                    {ing.amount} {ing.unit} of Ingredient ID {ing.ingredientId}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mb-4">
              <strong className="text-gray-300">Instructions:</strong>
              <ol className="list-decimal list-inside text-gray-300">
                {recipe.instructions.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>
            </div>
            <p className="text-gray-300 mb-2">
              <strong>Tags:</strong>{' '}
              {recipe.tags?.join(', ') || 'No tags provided.'}
            </p>
            <div className="mt-4 flex space-x-2">
              <button
                onClick={() => window.history.back()}
                className="px-4 py-2 bg-button-blue hover:bg-button-blue-hover text-white rounded-lg transition-colors"
              >
                Back to Cookbook
              </button>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
