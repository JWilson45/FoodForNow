'use client';

import Head from 'next/head';
import { useState } from 'react';

export default function Ingredients() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    calories: '',
    fat: '',
    protein: '',
    carbohydrates: '',
    fiber: '',
  });
  const [nutritionVisible, setNutritionVisible] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      name: formData.name.trim(),
      description: formData.description.trim() || undefined,
      calories: formData.calories ? parseFloat(formData.calories) : undefined,
      nutritionalInfo: {
        fat: formData.fat ? parseFloat(formData.fat) : undefined,
        protein: formData.protein ? parseFloat(formData.protein) : undefined,
        carbohydrates: formData.carbohydrates
          ? parseFloat(formData.carbohydrates)
          : undefined,
        fiber: formData.fiber ? parseFloat(formData.fiber) : undefined,
      },
    };

    if (!data.name) {
      alert('Please provide a name for the ingredient.');
      return;
    }

    const res = await fetch('/api/ingredients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      alert('Ingredient added successfully!');
      setFormData({
        name: '',
        description: '',
        calories: '',
        fat: '',
        protein: '',
        carbohydrates: '',
        fiber: '',
      });
    } else {
      const err = await res.json();
      alert(err.error || 'An error occurred.');
    }
  };

  return (
    <>
      <Head>
        <title>Insert Ingredient</title>
      </Head>
      <form
        id="ingredientForm"
        aria-labelledby="formTitle"
        onSubmit={handleSubmit}
      >
        <h2 id="formTitle">Insert Ingredient</h2>

        <label htmlFor="ingredientName">Name:</label>
        <input
          type="text"
          id="ingredientName"
          name="name"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />

        <label htmlFor="ingredientDescription">Description:</label>
        <textarea
          id="ingredientDescription"
          name="description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        ></textarea>

        <label htmlFor="ingredientCalories">Calories:</label>
        <input
          type="number"
          id="ingredientCalories"
          name="calories"
          min="0"
          value={formData.calories}
          onChange={(e) =>
            setFormData({ ...formData, calories: e.target.value })
          }
        />

        <label htmlFor="ingredientImage">Image:</label>
        <input type="file" id="ingredientImage" name="image" accept="image/*" />

        <fieldset className="nutrition-fieldset">
          <legend>
            <button
              type="button"
              id="toggleNutritionFacts"
              aria-expanded={nutritionVisible ? 'true' : 'false'}
              className="nutrition-toggle-btn"
              onClick={() => setNutritionVisible(!nutritionVisible)}
            >
              Nutritional Information {nutritionVisible ? '▲' : '▼'}
            </button>
          </legend>
          {nutritionVisible && (
            <div id="nutritionFactsContent">
              <label htmlFor="ingredientFat">Fat (g):</label>
              <input
                type="number"
                id="ingredientFat"
                name="fat"
                min="0"
                value={formData.fat}
                onChange={(e) =>
                  setFormData({ ...formData, fat: e.target.value })
                }
              />

              <label htmlFor="ingredientProtein">Protein (g):</label>
              <input
                type="number"
                id="ingredientProtein"
                name="protein"
                min="0"
                value={formData.protein}
                onChange={(e) =>
                  setFormData({ ...formData, protein: e.target.value })
                }
              />

              <label htmlFor="ingredientCarbohydrates">
                Carbohydrates (g):
              </label>
              <input
                type="number"
                id="ingredientCarbohydrates"
                name="carbohydrates"
                min="0"
                value={formData.carbohydrates}
                onChange={(e) =>
                  setFormData({ ...formData, carbohydrates: e.target.value })
                }
              />

              <label htmlFor="ingredientFiber">Fiber (g):</label>
              <input
                type="number"
                id="ingredientFiber"
                name="fiber"
                min="0"
                value={formData.fiber}
                onChange={(e) =>
                  setFormData({ ...formData, fiber: e.target.value })
                }
              />
            </div>
          )}
        </fieldset>

        <div className="progress-bar-container">
          <div id="progressBar" className="progress-bar"></div>
        </div>

        <button type="submit" id="submitIngredient">
          Add Ingredient
        </button>
      </form>
    </>
  );
}
