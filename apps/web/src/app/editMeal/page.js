'use client';

import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import config from '@/config';

export default function EditMeal() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const mealId = searchParams.get('id'); // Retrieve the meal ID from the query

  const [recipes, setRecipes] = useState([]);
  const [recipeInputs, setRecipeInputs] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    mealTime: '',
    servings: '',
    calories: '',
    tags: '',
    isVegetarian: false,
    isVegan: false,
    cuisine: '',
  });

  useEffect(() => {
    if (!mealId) return;

    // Fetch meal details and available recipes
    Promise.all([
      fetch(`${config.apiBaseUrl}/meals/${mealId}`, {
        credentials: 'include',
      }).then((res) => res.json()),
      fetch(`${config.apiBaseUrl}/recipes`, { credentials: 'include' }).then(
        (res) => res.json()
      ),
    ])
      .then(([mealData, recipesData]) => {
        const meal = mealData.meal;
        setRecipes(recipesData.recipes || []);
        setFormData({
          name: meal.name || '',
          description: meal.description || '',
          mealTime: meal.mealTime || '',
          servings: meal.servings?.toString() || '',
          calories: meal.calories?.toString() || '',
          tags: meal.tags?.join(', ') || '',
          isVegetarian: meal.isVegetarian || false,
          isVegan: meal.isVegan || false,
          cuisine: meal.cuisine || '',
        });
        setRecipeInputs(
          meal.recipes?.map((r) => ({ name: r.name, id: r._id })) || [
            { name: '', id: '' },
          ]
        );
      })
      .catch((err) => {
        console.error('Error:', err);
        alert('Error fetching meal details. Redirecting to meals page.');
        router.push('/viewMeals');
      });
  }, [mealId, router]);

  const addRecipeField = () => {
    setRecipeInputs((prev) => [...prev, { name: '', id: '' }]);
  };

  const removeRecipeField = (index) => {
    setRecipeInputs((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRecipeChange = (index, value) => {
    const lowerVal = value.trim().toLowerCase();
    const matched = recipes.find((r) => r.name.toLowerCase() === lowerVal);
    setRecipeInputs((prev) => {
      const copy = [...prev];
      copy[index] = { name: value, id: matched?._id || '' };
      return copy;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!mealId) return;

    // Validate recipe IDs
    for (let r of recipeInputs) {
      if (!r.id || !/^[a-fA-F0-9]{24}$/.test(r.id)) {
        alert('One or more recipes are invalid.');
        return;
      }
    }

    const tagsArray = formData.tags
      ? formData.tags.split(',').map((t) => t.trim())
      : undefined;
    const data = {
      name: formData.name.trim(),
      description: formData.description.trim() || undefined,
      recipes: recipeInputs.map((r) => r.id),
      mealTime: formData.mealTime || undefined,
      servings: parseInt(formData.servings),
      calories: formData.calories ? parseFloat(formData.calories) : undefined,
      tags: tagsArray,
      isVegetarian: formData.isVegetarian,
      isVegan: formData.isVegan,
      cuisine: formData.cuisine || undefined,
    };

    const res = await fetch(`${config.apiBaseUrl}/meals/${mealId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include',
    });

    if (res.ok) {
      alert('Meal updated successfully!');
      router.push('/viewMeals');
    } else {
      const errData = await res.json();
      alert(errData.error || 'Error updating meal.');
    }
  };

  return (
    <>
      <Head>
        <title>Edit Meal</title>
      </Head>
      <main className="flex justify-center items-center p-6 bg-gray-900 min-h-screen">
        <form
          id="editMealForm"
          onSubmit={handleSubmit}
          aria-labelledby="formTitle"
          className="w-full max-w-2xl bg-black/80 border-2 border-button-blue rounded-xl p-8 shadow-custom animate-fadeIn"
        >
          <h2
            id="formTitle"
            className="text-2xl font-bold mb-6 text-center text-white"
          >
            Edit Meal
          </h2>

          {/* Name */}
          <div className="mb-4">
            <label
              htmlFor="mealName"
              className="block mb-2 text-gray-300 font-semibold"
            >
              Name:
            </label>
            <input
              type="text"
              id="mealName"
              name="name"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 outline-none focus:bg-gray-600 focus:shadow-custom-hover transition"
            />
          </div>

          {/* Description */}
          <div className="mb-4">
            <label
              htmlFor="mealDescription"
              className="block mb-2 text-gray-300 font-semibold"
            >
              Description:
            </label>
            <textarea
              id="mealDescription"
              name="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 outline-none focus:bg-gray-600 focus:shadow-custom-hover transition"
            ></textarea>
          </div>

          {/* Recipes */}
          <fieldset className="mb-6">
            <legend className="block mb-2 text-gray-300 font-semibold">
              Recipes:
            </legend>
            <div id="recipesContainer" className="space-y-4">
              {recipeInputs.map((ri, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <label
                      htmlFor={`recipeName${i + 1}`}
                      className="text-gray-300"
                    >
                      Recipe {i + 1}:
                    </label>
                    <input
                      type="text"
                      id={`recipeName${i + 1}`}
                      required
                      value={ri.name}
                      onChange={(e) => handleRecipeChange(i, e.target.value)}
                      list={`recipesDatalist${i + 1}`}
                      className="flex-1 p-3 bg-gray-700 text-white rounded-lg border border-gray-600 outline-none focus:bg-gray-600 focus:shadow-custom-hover transition"
                    />
                    {recipeInputs.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeRecipeField(i)}
                        className="text-red-500 hover:text-red-700"
                        aria-label={`Remove recipe ${i + 1}`}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <datalist id={`recipesDatalist${i + 1}`}>
                    {recipes.map((r) => (
                      <option key={r._id} value={r.name}></option>
                    ))}
                  </datalist>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addRecipeField}
              className="mt-4 px-4 py-2 bg-button-blue hover:bg-button-blue-hover text-white rounded-lg transition-colors"
            >
              Add Recipe
            </button>
          </fieldset>

          {/* Remaining fields */}
          {/* ... */}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-button-blue hover:bg-button-blue-hover active:bg-button-blue-active text-white font-bold uppercase rounded-lg transition-transform transform hover:scale-105 active:scale-100 shadow-custom hover:shadow-custom-hover"
          >
            Update Meal
          </button>
        </form>
      </main>
    </>
  );
}
