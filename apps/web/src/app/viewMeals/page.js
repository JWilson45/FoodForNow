'use client';

import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/Button';

export default function ViewMeals() {
  const [meals, setMeals] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/meals', { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => setMeals(data.meals || []))
      .catch((err) => console.error('Error fetching meals:', err));
  }, []);

  const displayedMeals = meals.slice(currentIndex, currentIndex + 2);

  const handleDelete = async (mealId) => {
    if (confirm('Are you sure you want to delete this meal?')) {
      const res = await fetch(`/api/meals/${mealId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (res.ok) {
        alert('Meal deleted successfully!');
        setMeals((prev) => prev.filter((m) => m._id !== mealId));
      } else {
        const errData = await res.json();
        alert(errData.error || 'Error deleting meal.');
      }
    }
  };

  return (
    <>
      <Head>
        <title>My Meals</title>
      </Head>
      <main className="container mx-auto p-6 bg-gray-900 min-h-screen">
        <h2 className="text-3xl font-bold mb-6 text-center text-white">
          My Meals
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {displayedMeals.length === 0 ? (
            <p className="text-gray-300">No meals found.</p>
          ) : (
            displayedMeals.map((meal) => (
              <div
                key={meal._id}
                className="bg-black/80 border-2 border-button-blue rounded-xl p-6 shadow-custom hover:shadow-custom-hover transition-shadow"
              >
                <h3 className="text-xl font-semibold text-white mb-2">
                  {meal.name}
                </h3>
                <p className="text-gray-300">
                  <strong>Servings:</strong> {meal.servings}
                </p>
                <p className="text-gray-300">
                  <strong>Calories:</strong> {meal.calories || 'N/A'}
                </p>
                <p className="text-gray-300">
                  <strong>Meal Time:</strong> {meal.mealTime || 'N/A'}
                </p>
                <p className="text-gray-300">
                  <strong>Cuisine:</strong> {meal.cuisine || 'N/A'}
                </p>
                <p className="text-gray-300">
                  <strong>Tags:</strong> {meal.tags?.join(', ') || 'None'}
                </p>
                <p className="text-gray-300">
                  <strong>Is Vegetarian:</strong>{' '}
                  {meal.isVegetarian ? 'Yes' : 'No'}
                </p>
                <p className="text-gray-300">
                  <strong>Is Vegan:</strong> {meal.isVegan ? 'Yes' : 'No'}
                </p>
                <p className="text-gray-300 mb-2">
                  <strong>Description:</strong>{' '}
                  {meal.description || 'No description provided.'}
                </p>
                <p className="text-gray-300 mb-2">
                  <strong>Recipes:</strong>
                </p>
                <ul className="list-disc list-inside text-gray-300">
                  {meal.recipes.map((recipe) => (
                    <li key={recipe._id}>
                      {recipe.name} (Prep: {recipe.prepTime} mins, Cook:{' '}
                      {recipe.cookTime} mins)
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex space-x-2">
                  <Button
                    onClick={() => router.push(`/editMeal?id=${meal._id}`)}
                    className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors"
                  >
                    Edit Meal
                  </Button>
                  <Button
                    onClick={() => handleDelete(meal._id)}
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                  >
                    Delete Meal
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
        {/* Navigation Buttons */}
        <div className="flex justify-center items-center mt-6 space-x-4">
          <Button
            onClick={() => setCurrentIndex((i) => Math.max(i - 2, 0))}
            disabled={currentIndex === 0}
            className={`px-4 py-2 bg-button-blue hover:bg-button-blue-hover text-white rounded-lg transition-colors ${
              currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            Previous
          </Button>
          <Button
            onClick={() => setCurrentIndex((i) => i + 2)}
            disabled={currentIndex + 2 >= meals.length}
            className={`px-4 py-2 bg-button-blue hover:bg-button-blue-hover text-white rounded-lg transition-colors ${
              currentIndex + 2 >= meals.length
                ? 'opacity-50 cursor-not-allowed'
                : ''
            }`}
          >
            Next
          </Button>
        </div>
      </main>
    </>
  );
}