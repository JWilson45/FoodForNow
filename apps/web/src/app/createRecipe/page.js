'use client';

import Head from 'next/head';
import { useState, useEffect } from 'react';

export default function CreateRecipe() {
  const [instructions, setInstructions] = useState(['']);
  const [ingredients, setIngredients] = useState([
    { name: '', id: '', amount: '', unit: '', notes: '' },
  ]);
  const [allIngredients, setAllIngredients] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    alias: '',
    description: '',
    servings: '',
    prepTime: '',
    cookTime: '',
    mealTime: '',
    cuisine: '',
    calories: '',
    tags: [],
    isPublic: false,
  });

  useEffect(() => {
    fetch('/api/ingredients')
      .then((res) => res.json())
      .then((data) => setAllIngredients(data.ingredients || []))
      .catch(() => {});
  }, []);

  const addInstruction = () => setInstructions((prev) => [...prev, '']);
  const removeInstruction = (index) =>
    setInstructions((prev) => prev.filter((_, i) => i !== index));
  const updateInstruction = (index, value) => {
    setInstructions((prev) => {
      const copy = [...prev];
      copy[index] = value;
      return copy;
    });
  };

  const addIngredientField = () => {
    setIngredients((prev) => [
      ...prev,
      { name: '', id: '', amount: '', unit: '', notes: '' },
    ]);
  };
  const removeIngredientField = (index) => {
    setIngredients((prev) => prev.filter((_, i) => i !== index));
  };
  const updateIngredientField = (index, field, value) => {
    setIngredients((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      if (field === 'name') {
        const matched = allIngredients.find(
          (ing) => ing.name.toLowerCase() === value.trim().toLowerCase()
        );
        copy[index].id = matched?._id || '';
      }
      return copy;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate ingredients IDs
    for (let ing of ingredients) {
      if (!ing.id) {
        alert('One or more ingredients are not selected from the list.');
        return;
      }
    }

    const data = {
      name: formData.name.trim(),
      alias: formData.alias.trim() || undefined,
      description: formData.description.trim() || undefined,
      instructions: instructions.map((i) => i.trim()).filter((i) => i),
      ingredients: ingredients.map((ing) => ({
        ingredientId: ing.id,
        amount: parseFloat(ing.amount),
        unit: ing.unit.trim(),
        notes: ing.notes.trim() || undefined,
      })),
      servings: parseInt(formData.servings),
      prepTime: parseInt(formData.prepTime),
      cookTime: parseInt(formData.cookTime),
      mealTime: formData.mealTime || undefined,
      cuisine: formData.cuisine || undefined,
      calories: formData.calories ? parseFloat(formData.calories) : undefined,
      tags: formData.tags
        ? formData.tags.split(',').map((t) => t.trim())
        : undefined,
      isPublic: formData.isPublic,
    };

    const res = await fetch('/api/recipes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      alert('Recipe created successfully!');
      window.location.href = 'cookbook';
    } else {
      const errData = await res.json();
      alert(errData.error || 'An error occurred.');
    }
  };

  return (
    <>
      <Head>
        <title>Create Recipe</title>
      </Head>
      <form id="recipeForm" onSubmit={handleSubmit} aria-labelledby="formTitle">
        <h2 id="formTitle">Create Recipe</h2>
        <label htmlFor="recipeName">Name:</label>
        <input
          type="text"
          id="recipeName"
          name="name"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />

        <label htmlFor="recipeAlias">Alias:</label>
        <input
          type="text"
          id="recipeAlias"
          name="alias"
          value={formData.alias}
          onChange={(e) => setFormData({ ...formData, alias: e.target.value })}
        />

        <label htmlFor="recipeDescription">Description:</label>
        <textarea
          id="recipeDescription"
          name="description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        ></textarea>

        <fieldset>
          <legend>Instructions:</legend>
          <div id="instructionsContainer">
            {instructions.map((inst, i) => (
              <div key={i} className="instruction-item">
                <label>Step {i + 1}:</label>
                <input
                  type="text"
                  required
                  value={inst}
                  onChange={(e) => updateInstruction(i, e.target.value)}
                />
                <button
                  type="button"
                  className="removeInstructionButton"
                  onClick={() => removeInstruction(i)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            id="addInstructionButton"
            onClick={addInstruction}
          >
            Add Instruction
          </button>
        </fieldset>

        <fieldset>
          <legend>Ingredients:</legend>
          <div id="ingredientsContainer">
            {ingredients.map((ing, i) => (
              <div key={i} className="ingredient-item">
                <label>Ingredient {i + 1}:</label>
                <input
                  type="text"
                  list={`ingredientsDatalist${i}`}
                  required
                  value={ing.name}
                  onChange={(e) =>
                    updateIngredientField(i, 'name', e.target.value)
                  }
                />
                <datalist id={`ingredientsDatalist${i}`}>
                  {allIngredients.map((ai) => (
                    <option key={ai._id} value={ai.name}></option>
                  ))}
                </datalist>

                <label>Amount:</label>
                <input
                  type="number"
                  min="0"
                  required
                  value={ing.amount}
                  onChange={(e) =>
                    updateIngredientField(i, 'amount', e.target.value)
                  }
                />

                <label>Unit:</label>
                <input
                  type="text"
                  required
                  value={ing.unit}
                  onChange={(e) =>
                    updateIngredientField(i, 'unit', e.target.value)
                  }
                />

                <label>Notes:</label>
                <input
                  type="text"
                  value={ing.notes}
                  onChange={(e) =>
                    updateIngredientField(i, 'notes', e.target.value)
                  }
                />

                <button
                  type="button"
                  className="removeIngredientButton"
                  onClick={() => removeIngredientField(i)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            id="addIngredientButton"
            onClick={addIngredientField}
          >
            Add Ingredient
          </button>
        </fieldset>

        <label htmlFor="recipeServings">Servings:</label>
        <input
          type="number"
          id="recipeServings"
          name="servings"
          min="1"
          required
          value={formData.servings}
          onChange={(e) =>
            setFormData({ ...formData, servings: e.target.value })
          }
        />

        <label htmlFor="recipePrepTime">Prep Time (minutes):</label>
        <input
          type="number"
          id="recipePrepTime"
          name="prepTime"
          min="0"
          required
          value={formData.prepTime}
          onChange={(e) =>
            setFormData({ ...formData, prepTime: e.target.value })
          }
        />

        <label htmlFor="recipeCookTime">Cook Time (minutes):</label>
        <input
          type="number"
          id="recipeCookTime"
          name="cookTime"
          min="0"
          required
          value={formData.cookTime}
          onChange={(e) =>
            setFormData({ ...formData, cookTime: e.target.value })
          }
        />

        <label htmlFor="recipeMealTime">Meal Time:</label>
        <select
          id="recipeMealTime"
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

        <label htmlFor="recipeCuisine">Cuisine:</label>
        <select
          id="recipeCuisine"
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

        <label htmlFor="recipeCalories">Calories:</label>
        <input
          type="number"
          id="recipeCalories"
          name="calories"
          min="0"
          value={formData.calories}
          onChange={(e) =>
            setFormData({ ...formData, calories: e.target.value })
          }
        />

        <label htmlFor="recipeTags">Tags (comma-separated):</label>
        <input
          type="text"
          id="recipeTags"
          name="tags"
          onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
        />

        <label htmlFor="recipeIsPublic">Make Public:</label>
        <input
          type="checkbox"
          id="recipeIsPublic"
          name="isPublic"
          checked={formData.isPublic}
          onChange={(e) =>
            setFormData({ ...formData, isPublic: e.target.checked })
          }
        />

        <button type="submit" id="submitRecipe">
          Create Recipe
        </button>
      </form>
    </>
  );
}
