'use client';

import Head from 'next/head';
import { useState, useEffect } from 'react';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Pagination from '@/components/Pagination';
import config from '@/config';

export default function ViewMeals() {
  const [meals, setMeals] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 2;

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const res = await fetch(`${config.apiBaseUrl}/meals`, {
          credentials: 'include',
        });
        if (!res.ok) {
          throw new Error(`Error fetching meals: ${res.statusText}`);
        }
        const data = await res.json();
        setMeals(data.meals || []);
      } catch (err) {
        console.error('Error fetching meals:', err);
      }
    };

    fetchMeals();
  }, []);

  const displayedMeals = meals.slice(currentIndex, currentIndex + itemsPerPage);

  const handleDelete = async (mealId) => {
    if (confirm('Are you sure you want to delete this meal?')) {
      try {
        const res = await fetch(`${config.apiBaseUrl}/meals/${mealId}`, {
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
      } catch (error) {
        console.error('Error deleting meal:', error);
        alert('An unexpected error occurred. Please try again.');
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
              <Card key={meal._id} title={meal.name}>
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
                <p className="text-gray-300 mb-2">
                  <strong>Recipes:</strong>
                </p>
                <ul className="list-disc list-inside text-gray-300 mb-2">
                  {meal.recipes.map((recipe) => (
                    <li key={recipe._id || recipe.id}>
                      {recipe.name} (Prep: {recipe.prepTime} mins, Cook:{' '}
                      {recipe.cookTime} mins)
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex space-x-2">
                  <Button
                    href={`/editMeal?id=${meal._id}`}
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
              </Card>
            ))
          )}
        </div>
        <Pagination
          currentIndex={currentIndex}
          totalItems={meals.length}
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
