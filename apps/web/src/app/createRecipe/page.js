'use client';

import Head from 'next/head';
import { useState, useEffect } from 'react';
import Label from '@/components/Label';
import Input from '@/components/Input';
import Textarea from '@/components/Textarea';
import Button from '@/components/Button';
import Select from '@/components/Select';
import Checkbox from '@/components/Checkbox';

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
    tags: '',
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
      <main className="flex justify-center items-center p-6 bg-gray-900 min-h-screen">
        <form
          id="recipeForm"
          onSubmit={handleSubmit}
          aria-labelledby="formTitle"
          className="w-full max-w-2xl bg-black/80 border-2 border-button-blue rounded-xl p-8 shadow-custom animate-fadeIn"
        >
          <h2
            id="formTitle"
            className="text-2xl font-bold mb-6 text-center text-white"
          >
            Create Recipe
          </h2>
          <div className="mb-4">
            <Label htmlFor="recipeName">Name:</Label>
            <Input
              id="recipeName"
              name="name"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="recipeAlias">Alias:</Label>
            <Input
              id="recipeAlias"
              name="alias"
              value={formData.alias}
              onChange={(e) =>
                setFormData({ ...formData, alias: e.target.value })
              }
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="recipeDescription">Description:</Label>
            <Textarea
              id="recipeDescription"
              name="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>
          <fieldset className="mb-6">
            <legend className="block mb-2 text-gray-300 font-semibold">
              Instructions:
            </legend>
            <div className="space-y-4">
              {instructions.map((inst, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <span className="text-gray-300">Step {i + 1}:</span>
                  <Input
                    id={`instruction-${i}`}
                    name={`instruction-${i}`}
                    required
                    value={inst}
                    onChange={(e) => updateInstruction(i, e.target.value)}
                  />
                  {instructions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeInstruction(i)}
                      className="text-red-500 hover:text-red-700"
                      aria-label={`Remove instruction ${i + 1}`}
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
            <Button
              type="button"
              onClick={addInstruction}
              className="mt-4 px-4 py-2"
            >
              Add Instruction
            </Button>
          </fieldset>
          <fieldset className="mb-6">
            <legend className="block mb-2 text-gray-300 font-semibold">
              Ingredients:
            </legend>
            <div className="space-y-4">
              {ingredients.map((ing, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-300">Ingredient {i + 1}:</span>
                    <Input
                      id={`ingredient-${i}`}
                      name={`ingredient-${i}`}
                      required
                      value={ing.name}
                      onChange={(e) =>
                        updateIngredientField(i, 'name', e.target.value)
                      }
                      list={`ingredientsDatalist${i}`}
                    />
                    {ingredients.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeIngredientField(i)}
                        className="text-red-500 hover:text-red-700"
                        aria-label={`Remove ingredient ${i + 1}`}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <datalist id={`ingredientsDatalist${i}`}>
                    {allIngredients.map((ai) => (
                      <option key={ai._id} value={ai.name}></option>
                    ))}
                  </datalist>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label>Amount:</Label>
                      <Input
                        type="number"
                        min="0"
                        required
                        value={ing.amount}
                        onChange={(e) =>
                          updateIngredientField(i, 'amount', e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <Label>Unit:</Label>
                      <Input
                        required
                        value={ing.unit}
                        onChange={(e) =>
                          updateIngredientField(i, 'unit', e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <Label>Notes:</Label>
                      <Input
                        value={ing.notes}
                        onChange={(e) =>
                          updateIngredientField(i, 'notes', e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Button
              type="button"
              onClick={addIngredientField}
              className="mt-4 px-4 py-2"
            >
              Add Ingredient
            </Button>
          </fieldset>
          <div className="mb-4">
            <Label htmlFor="recipeServings">Servings:</Label>
            <Input
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
          </div>
          <div className="mb-4">
            <Label htmlFor="recipePrepTime">Prep Time (minutes):</Label>
            <Input
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
          </div>
          <div className="mb-4">
            <Label htmlFor="recipeCookTime">Cook Time (minutes):</Label>
            <Input
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
          </div>
          <div className="mb-4">
            <Label htmlFor="recipeMealTime">Meal Time:</Label>
            <Select
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
            </Select>
          </div>
          <div className="mb-4">
            <Label htmlFor="recipeCuisine">Cuisine:</Label>
            <Select
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
            </Select>
          </div>
          <div className="mb-4">
            <Label htmlFor="recipeCalories">Calories:</Label>
            <Input
              type="number"
              id="recipeCalories"
              name="calories"
              min="0"
              value={formData.calories}
              onChange={(e) =>
                setFormData({ ...formData, calories: e.target.value })
              }
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="recipeTags">Tags (comma-separated):</Label>
            <Input
              id="recipeTags"
              name="tags"
              value={formData.tags}
              onChange={(e) =>
                setFormData({ ...formData, tags: e.target.value })
              }
            />
          </div>
          <div className="mb-6">
            <Checkbox
              id="recipeIsPublic"
              name="isPublic"
              checked={formData.isPublic}
              onChange={(e) =>
                setFormData({ ...formData, isPublic: e.target.checked })
              }
              label="Make Public"
            />
          </div>
          <Button type="submit" className="w-full py-3">
            Create Recipe
          </Button>
        </form>
      </main>
    </>
  );
}
