'use client';

import Head from 'next/head';
import { useState, useEffect } from 'react';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Pagination from '@/components/Pagination';
import config from '@/config';

export default function Cookbook() {
  const [recipes, setRecipes] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 2;

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const res = await fetch(`${config.apiBaseUrl}/recipes`, {
          credentials: 'include',
        });
        if (!res.ok) {
          throw new Error(`Error fetching recipes: ${res.statusText}`);
        }
        const data = await res.json();
        setRecipes(data.recipes || []);
      } catch (err) {
        console.error('Error fetching recipes:', err);
      }
    };

    fetchRecipes();
  }, []);

  const displayedRecipes = recipes.slice(
    currentIndex,
    currentIndex + itemsPerPage
  );

  return (
    <>
      <Head>
        <title>My Cookbook</title>
      </Head>
      <main className="container mx-auto p-6 bg-gray-900 min-h-screen">
        <h2 className="text-3xl font-bold mb-6 text-center text-white">
          My Cookbook
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {displayedRecipes.length === 0 ? (
            <p className="text-gray-300">No recipes found.</p>
          ) : (
            displayedRecipes.map((recipe) => (
              <Card key={recipe._id} title={recipe.name}>
                <p className="text-gray-300">
                  <strong>Servings:</strong> {recipe.servings}
                </p>
                <p className="text-gray-300">
                  <strong>Prep Time:</strong> {recipe.prepTime} minutes
                </p>
                <p className="text-gray-300">
                  <strong>Cook Time:</strong> {recipe.cookTime} minutes
                </p>
                <p className="text-gray-300">
                  <strong>Ingredients:</strong>
                </p>
                <ul className="list-disc list-inside text-gray-300 mb-2">
                  {recipe.ingredients.map((ing) => (
                    <li key={ing.ingredientId || ing.id}>
                      {ing.amount} {ing.unit} of Ingredient ID{' '}
                      {ing.ingredientId}
                    </li>
                  ))}
                </ul>
                <p className="text-gray-300">
                  <strong>Instructions:</strong>
                </p>
                <ol className="list-decimal list-inside text-gray-300 mb-2">
                  {recipe.instructions.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>
                <p className="text-gray-300">
                  <strong>Description:</strong>{' '}
                  {recipe.description || 'No description provided.'}
                </p>
                <div className="mt-4 flex space-x-2">
                  <Button
                    href={`/viewRecipe?id=${recipe._id}`}
                    className="px-4 py-2 bg-button-blue hover:bg-button-blue-hover text-white rounded-lg transition-colors"
                  >
                    View Recipe
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>
        <Pagination
          currentIndex={currentIndex}
          totalItems={recipes.length}
          itemsPerPage={itemsPerPage}
          onPrevious={() =>
            setCurrentIndex((i) => Math.max(i - itemsPerPage, 0))
          }
          onNext={() => setCurrentIndex((i) => i + itemsPerPage)}
        />
      </main>
    </>
  );
}
