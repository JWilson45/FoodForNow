'use client';

import Head from 'next/head';
import { useState, useEffect } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

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
      window.location.href = 'viewMeals';
    } else if (res.status === 401) {
      alert('You must be logged in to create a meal.');
      window.location.href = 'login';
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
      <Header />
      <main className="form-container">
        <form
          id="mealForm"
          onSubmit={handleSubmit}
          className="meal-form"
          aria-labelledby="formTitle"
        >
          <h2 id="formTitle">Create Meal</h2>
          <div className="form-group">
            <label htmlFor="mealName">Name:</label>
            <input
              type="text"
              id="mealName"
              name="name"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>
          <div className="form-group">
            <label htmlFor="mealDescription">Description:</label>
            <textarea
              id="mealDescription"
              name="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            ></textarea>
          </div>
          <fieldset className="form-group">
            <legend>Recipes:</legend>
            <div id="recipesContainer">
              {recipeInputs.map((recipeInput, i) => (
                <div className="recipe-item" key={i}>
                  <label htmlFor={`recipeName${i + 1}`}>Recipe {i + 1}:</label>
                  <input
                    type="text"
                    id={`recipeName${i + 1}`}
                    placeholder="Start typing recipe name..."
                    required
                    value={recipeInput.name}
                    onChange={(e) => handleRecipeChange(i, e.target.value)}
                    list={`recipesDatalist${i + 1}`}
                  />
                  <datalist id={`recipesDatalist${i + 1}`}>
                    {recipes.map((r) => (
                      <option key={r._id} value={r.name}></option>
                    ))}
                  </datalist>
                  <button
                    type="button"
                    className="removeRecipeButton"
                    onClick={() => removeRecipeField(i)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              id="addRecipeButton"
              className="btn btn-secondary"
              onClick={addRecipeField}
            >
              Add Recipe
            </button>
          </fieldset>
          <div className="form-group">
            <label htmlFor="mealMealTime">Meal Time:</label>
            <select
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
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="mealServings">Servings:</label>
            <input
              type="number"
              id="mealServings"
              name="servings"
              min="1"
              required
              value={formData.servings}
              onChange={(e) =>
                setFormData({ ...formData, servings: e.target.value })
              }
            />
          </div>
          <div className="form-group">
            <label htmlFor="mealCalories">Calories:</label>
            <input
              type="number"
              id="mealCalories"
              name="calories"
              min="0"
              value={formData.calories}
              onChange={(e) =>
                setFormData({ ...formData, calories: e.target.value })
              }
            />
          </div>
          <div className="form-group">
            <label htmlFor="mealTags">Tags (comma-separated):</label>
            <input
              type="text"
              id="mealTags"
              name="tags"
              value={formData.tags}
              onChange={(e) =>
                setFormData({ ...formData, tags: e.target.value })
              }
            />
          </div>
          <div className="form-group checkbox-group">
            <label htmlFor="mealIsVegetarian">Is Vegetarian:</label>
            <input
              type="checkbox"
              id="mealIsVegetarian"
              name="isVegetarian"
              checked={formData.isVegetarian}
              onChange={(e) =>
                setFormData({ ...formData, isVegetarian: e.target.checked })
              }
            />
          </div>
          <div className="form-group checkbox-group">
            <label htmlFor="mealIsVegan">Is Vegan:</label>
            <input
              type="checkbox"
              id="mealIsVegan"
              name="isVegan"
              checked={formData.isVegan}
              onChange={(e) =>
                setFormData({ ...formData, isVegan: e.target.checked })
              }
            />
          </div>
          <div className="form-group">
            <label htmlFor="mealCuisine">Cuisine:</label>
            <select
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
            </select>
          </div>
          <button type="submit" id="submitMeal" className="btn btn-primary">
            Create Meal
          </button>
        </form>
      </main>
      <Footer />
    </>
  );
}
