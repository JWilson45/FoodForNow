'use client';

import Head from 'next/head';
import { useState, useEffect } from 'react';
import Label from '@/components/Label';
import Input from '@/components/Input';
import Select from '@/components/Select';
import Checkbox from '@/components/Checkbox';
import Button from '@/components/Button';

export default function CreateMeal() {
  const [recipes, setRecipes] = useState([]);
  const [recipeInputs, setRecipeInputs] = useState([{ name: '', id: '' }]);
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
    fetch('/api/recipes', { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => setRecipes(data.recipes || []))
      .catch(() => {});
  }, []);

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
    const valid = recipeInputs.every(
      (r) => r.id && /^[a-fA-F0-9]{24}$/.test(r.id)
    );
    if (!valid) {
      alert('Please ensure all recipes are selected correctly.');
      return;
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

    if (!data.name) {
      alert('Please provide a name for the meal.');
      return;
    }

    if (isNaN(data.servings) || data.servings < 1) {
      alert('Please provide a valid number of servings.');
      return;
    }

    if (data.recipes.length === 0) {
      alert('Please add at least one valid recipe.');
      return;
    }

    const res = await fetch('/api/meals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include',
    });

    if (res.ok) {
      alert('Meal created successfully!');
      window.location.href = '/viewMeals';
    } else if (res.status === 401) {
      alert('You must be logged in to create a meal.');
      window.location.href = '/signin';
    } else {
      const errData = await res.json();
      alert(errData.error || 'An error occurred while creating the meal.');
    }
  };

  return (
    <>
      <Head>
        <title>Create Meal</title>
      </Head>
      <main className="flex justify-center items-center p-6 bg-gray-900 min-h-screen">
        <form
          id="mealForm"
          onSubmit={handleSubmit}
          aria-labelledby="formTitle"
          className="w-full max-w-2xl bg-black/80 border-2 border-button-blue rounded-xl p-8 shadow-custom animate-fadeIn space-y-6"
        >
          <h2
            id="formTitle"
            className="text-2xl font-bold text-center text-white"
          >
            Create Meal
          </h2>

          {/* Name */}
          <div>
            <Label htmlFor="mealName">Name:</Label>
            <Input
              id="mealName"
              name="name"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Enter meal name"
            />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="mealDescription">Description:</Label>
            <textarea
              id="mealDescription"
              name="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 outline-none focus:bg-gray-600 focus:shadow-custom-hover transition"
              placeholder="Enter meal description"
            ></textarea>
          </div>

          {/* Recipes */}
          <fieldset className="space-y-4">
            <legend className="block mb-2 text-gray-300 font-semibold">
              Recipes:
            </legend>
            {recipeInputs.map((recipeInput, i) => (
              <div key={i} className="flex items-center space-x-2">
                <Input
                  id={`recipeName${i + 1}`}
                  name={`recipeName${i + 1}`}
                  required
                  value={recipeInput.name}
                  onChange={(e) => handleRecipeChange(i, e.target.value)}
                  placeholder={`Recipe ${i + 1} name`}
                  list={`recipesDatalist${i + 1}`}
                  className="flex-1"
                />
                <datalist id={`recipesDatalist${i + 1}`}>
                  {recipes.map((r) => (
                    <option key={r._id} value={r.name}></option>
                  ))}
                </datalist>
                {recipeInputs.length > 1 && (
                  <Button
                    type="button"
                    onClick={() => removeRecipeField(i)}
                    className="px-2 py-1 bg-red-500 hover:bg-red-600"
                  >
                    Remove
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              onClick={addRecipeField}
              className="px-4 py-2 bg-button-blue hover:bg-button-blue-hover"
            >
              Add Recipe
            </Button>
          </fieldset>

          {/* Meal Time */}
          <div>
            <Label htmlFor="mealMealTime">Meal Time:</Label>
            <Select
              id="mealMealTime"
              name="mealTime"
              value={formData.mealTime}
              onChange={(e) =>
                setFormData({ ...formData, mealTime: e.target.value })
              }
            >
              <option value="">Select meal time</option>
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
              <option value="snack">Snack</option>
              <option value="dessert">Dessert</option>
            </Select>
          </div>

          {/* Servings */}
          <div>
            <Label htmlFor="mealServings">Servings:</Label>
            <Input
              type="number"
              id="mealServings"
              name="servings"
              min="1"
              required
              value={formData.servings}
              onChange={(e) =>
                setFormData({ ...formData, servings: e.target.value })
              }
              placeholder="Enter number of servings"
            />
          </div>

          {/* Calories */}
          <div>
            <Label htmlFor="mealCalories">Calories:</Label>
            <Input
              type="number"
              id="mealCalories"
              name="calories"
              min="0"
              value={formData.calories}
              onChange={(e) =>
                setFormData({ ...formData, calories: e.target.value })
              }
              placeholder="Enter calories"
            />
          </div>

          {/* Tags */}
          <div>
            <Label htmlFor="mealTags">Tags (comma-separated):</Label>
            <Input
              id="mealTags"
              name="tags"
              value={formData.tags}
              onChange={(e) =>
                setFormData({ ...formData, tags: e.target.value })
              }
              placeholder="e.g., spicy, quick, vegan"
            />
          </div>

          {/* Vegetarian */}
          <Checkbox
            id="mealIsVegetarian"
            name="isVegetarian"
            checked={formData.isVegetarian}
            onChange={(e) =>
              setFormData({ ...formData, isVegetarian: e.target.checked })
            }
            label="Is Vegetarian"
          />

          {/* Vegan */}
          <Checkbox
            id="mealIsVegan"
            name="isVegan"
            checked={formData.isVegan}
            onChange={(e) =>
              setFormData({ ...formData, isVegan: e.target.checked })
            }
            label="Is Vegan"
          />

          {/* Cuisine */}
          <div>
            <Label htmlFor="mealCuisine">Cuisine:</Label>
            <Select
              id="mealCuisine"
              name="cuisine"
              value={formData.cuisine}
              onChange={(e) =>
                setFormData({ ...formData, cuisine: e.target.value })
              }
            >
              <option value="">Select cuisine</option>
              <option value="italian">Italian</option>
              <option value="chinese">Chinese</option>
              <option value="mexican">Mexican</option>
              <option value="indian">Indian</option>
              <option value="american">American</option>
              <option value="other">Other</option>
            </Select>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full py-3 bg-button-blue hover:bg-button-blue-hover"
          >
            Create Meal
          </Button>
        </form>
      </main>
    </>
  );
}
