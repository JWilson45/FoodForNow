'use client';

import Head from 'next/head';
import { useState } from 'react';
import Label from '@/components/Label';
import Input from '@/components/Input';
import Textarea from '@/components/Textarea';
import Button from '@/components/Button';
import Select from '@/components/Select';
import Checkbox from '@/components/Checkbox';
import RecipeSelect from '@/components/RecipeSelect';

export default function CreateMeal() {
  const [recipeInputs, setRecipeInputs] = useState([{ recipeId: '' }]);
  const [formErrors, setFormErrors] = useState({});
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

  const addRecipeField = () => {
    setRecipeInputs((prev) => [...prev, { recipeId: '' }]);
  };

  const removeRecipeField = (index) => {
    setRecipeInputs((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRecipeSelect = (index, selectedOption) => {
    setRecipeInputs((prev) => {
      const copy = [...prev];
      copy[index].recipeId = selectedOption ? selectedOption.value : '';
      return copy;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = {};
    if (!formData.name.trim()) {
      errors.name = 'Meal name is required.';
    }
    if (recipeInputs.some((r) => !r.recipeId)) {
      errors.recipes = 'All recipes must be selected.';
    }
    if (isNaN(formData.servings) || formData.servings < 1) {
      errors.servings = 'Please provide a valid number of servings.';
    }

    setFormErrors(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }

    const data = {
      name: formData.name.trim(),
      description: formData.description.trim() || undefined,
      recipes: recipeInputs.map((r) => r.recipeId),
      mealTime: formData.mealTime || undefined,
      servings: parseInt(formData.servings),
      calories: formData.calories ? parseFloat(formData.calories) : undefined,
      tags: formData.tags
        ? formData.tags.split(',').map((t) => t.trim())
        : undefined,
      isVegetarian: formData.isVegetarian,
      isVegan: formData.isVegan,
      cuisine: formData.cuisine || undefined,
    };

    try {
      const res = await fetch(`${config.apiBaseUrl}/meals`, {
        // Use config.apiBaseUrl
        method: 'POST',
        credentials: 'include', // Include cookies in the request
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        alert('Meal created successfully!');
        window.location.href = '/viewMeals';
      } else if (res.status === 401) {
        alert('You must be logged in to create a meal.');
        window.location.href = '/signin';
      } else {
        const errData = await res.json();
        if (errData.errors && Array.isArray(errData.errors)) {
          alert(
            errData.errors
              .map((error) => `${error.field}: ${error.message}`)
              .join('\n')
          );
        } else {
          alert(errData.error || 'An error occurred while creating the meal.');
        }
      }
    } catch (error) {
      console.error('Error creating meal:', error);
      alert('An unexpected error occurred. Please try again.');
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

          {/* Error Handling */}
          {Object.keys(formErrors).length > 0 && (
            <div className="mb-4">
              {Object.entries(formErrors).map(([key, message]) => (
                <p key={key} className="text-red-500">
                  {message}
                </p>
              ))}
            </div>
          )}

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
            <Textarea
              id="mealDescription"
              name="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Enter meal description"
            />
          </div>

          {/* Recipes */}
          <fieldset className="space-y-4">
            <legend className="block mb-2 text-gray-300 font-semibold">
              Recipes:
            </legend>
            {recipeInputs.map((rec, i) => (
              <div key={i} className="flex items-center space-x-2">
                <RecipeSelect
                  label={`Recipe ${i + 1}:`}
                  name={`recipe-${i}`}
                  required
                  onSelect={(selected) => handleRecipeSelect(i, selected)}
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
            ))}
            {formErrors.recipes && (
              <p className="text-red-500">{formErrors.recipes}</p>
            )}
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
              placeholder="Select meal time"
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
            {formErrors.servings && (
              <p className="text-red-500">{formErrors.servings}</p>
            )}
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
              type="text"
              id="mealTags"
              name="tags"
              value={formData.tags}
              onChange={(e) =>
                setFormData({ ...formData, tags: e.target.value })
              }
              placeholder="e.g., vegetarian, quick"
            />
          </div>

          {/* Dietary Preferences */}
          <div className="flex items-center space-x-4">
            <Checkbox
              id="mealIsVegetarian"
              name="isVegetarian"
              checked={formData.isVegetarian}
              onChange={(e) =>
                setFormData({ ...formData, isVegetarian: e.target.checked })
              }
              label="Is Vegetarian"
            />
            <Checkbox
              id="mealIsVegan"
              name="isVegan"
              checked={formData.isVegan}
              onChange={(e) =>
                setFormData({ ...formData, isVegan: e.target.checked })
              }
              label="Is Vegan"
            />
          </div>

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
              placeholder="Select cuisine"
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
