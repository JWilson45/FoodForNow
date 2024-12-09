'use client';

import Head from 'next/head';
import { useState, useEffect } from 'react';
import Label from '@/components/Label';
import Input from '@/components/Input';
import Textarea from '@/components/Textarea';
import Button from '@/components/Button';
import Select from '@/components/Select';
import Checkbox from '@/components/Checkbox';
import IngredientSelect from '@/components/IngredientSelect';

export default function CreateRecipe() {
  const [instructions, setInstructions] = useState(['']);
  const [ingredients, setIngredients] = useState([
    { ingredientId: '', amount: '', unit: '', notes: '' },
  ]);
  const [formErrors, setFormErrors] = useState({});
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

  // Fetch ingredients on component mount (if needed)
  // If using SearchableDropdown, fetching is handled within it

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
      { ingredientId: '', amount: '', unit: '', notes: '' },
    ]);
  };
  const removeIngredientField = (index) => {
    setIngredients((prev) => prev.filter((_, i) => i !== index));
  };
  const updateIngredientField = (index, field, value) => {
    setIngredients((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleIngredientSelect = (index, selectedOption) => {
    setIngredients((prev) => {
      const copy = [...prev];
      copy[index].ingredientId = selectedOption ? selectedOption.value : '';
      return copy;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = {};
    if (!formData.name.trim()) {
      errors.name = 'Recipe name is required.';
    }
    if (instructions.some((inst) => !inst.trim())) {
      errors.instructions = 'All instructions must be filled.';
    }
    if (
      ingredients.some((ing) => !ing.ingredientId || !ing.amount || !ing.unit)
    ) {
      errors.ingredients =
        'All ingredients must have valid selections and details.';
    }
    if (isNaN(formData.servings) || formData.servings < 1) {
      errors.servings = 'Please provide a valid number of servings.';
    }
    if (isNaN(formData.prepTime) || formData.prepTime < 0) {
      errors.prepTime = 'Please provide a valid prep time.';
    }
    if (isNaN(formData.cookTime) || formData.cookTime < 0) {
      errors.cookTime = 'Please provide a valid cook time.';
    }

    setFormErrors(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }

    const data = {
      name: formData.name.trim(),
      alias: formData.alias.trim() || undefined,
      description: formData.description.trim() || undefined,
      instructions: instructions.map((i) => i.trim()).filter((i) => i),
      ingredients: ingredients.map((ing) => ({
        ingredientId: ing.ingredientId,
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

    try {
      const res = await fetch('/api/recipes/', {
        // Ensure trailing slash
        method: 'POST',
        credentials: 'include', // Include cookies in the request
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        alert('Recipe created successfully!');
        window.location.href = '/cookbook';
      } else if (res.status === 401) {
        alert('You must be logged in to create a recipe.');
        window.location.href = '/signin';
      } else if (res.status === 409) {
        alert('Recipe already exists.');
      } else {
        const errData = await res.json();
        if (errData.errors && Array.isArray(errData.errors)) {
          alert(
            errData.errors
              .map((error) => `${error.field}: ${error.message}`)
              .join('\n')
          );
        } else {
          alert(
            errData.error || 'An error occurred while creating the recipe.'
          );
        }
      }
    } catch (error) {
      console.error('Error creating recipe:', error);
      alert('An unexpected error occurred. Please try again.');
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
          className="w-full max-w-2xl bg-black/80 border-2 border-button-blue rounded-xl p-8 shadow-custom animate-fadeIn space-y-6"
        >
          <h2
            id="formTitle"
            className="text-2xl font-bold text-center text-white"
          >
            Create Recipe
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
            <Label htmlFor="recipeName">Name:</Label>
            <Input
              id="recipeName"
              name="name"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Enter recipe name"
            />
          </div>

          {/* Alias */}
          <div>
            <Label htmlFor="recipeAlias">Alias:</Label>
            <Input
              id="recipeAlias"
              name="alias"
              value={formData.alias}
              onChange={(e) =>
                setFormData({ ...formData, alias: e.target.value })
              }
              placeholder="Enter recipe alias"
            />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="recipeDescription">Description:</Label>
            <Textarea
              id="recipeDescription"
              name="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Enter recipe description"
            />
          </div>

          {/* Instructions */}
          <fieldset className="space-y-4">
            <legend className="block mb-2 text-gray-300 font-semibold">
              Instructions:
            </legend>
            {instructions.map((inst, i) => (
              <div key={i} className="flex items-center space-x-2">
                <span className="text-gray-300">Step {i + 1}:</span>
                <Input
                  id={`instruction-${i}`}
                  name={`instruction-${i}`}
                  required
                  value={inst}
                  onChange={(e) => updateInstruction(i, e.target.value)}
                  placeholder={`Enter instruction ${i + 1}`}
                  className="flex-1"
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
            {formErrors.instructions && (
              <p className="text-red-500">{formErrors.instructions}</p>
            )}
            <Button
              type="button"
              onClick={addInstruction}
              className="px-4 py-2 bg-button-blue hover:bg-button-blue-hover"
            >
              Add Instruction
            </Button>
          </fieldset>

          {/* Ingredients */}
          <fieldset className="space-y-4">
            <legend className="block mb-2 text-gray-300 font-semibold">
              Ingredients:
            </legend>
            {ingredients.map((ing, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center space-x-2">
                  <IngredientSelect
                    label={`Ingredient ${i + 1}:`}
                    name={`ingredient-${i}`}
                    required
                    onSelect={(selected) => handleIngredientSelect(i, selected)}
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
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor={`amount-${i}`}>Amount:</Label>
                    <Input
                      type="number"
                      id={`amount-${i}`}
                      name={`amount-${i}`}
                      min="0"
                      required
                      value={ing.amount}
                      onChange={(e) =>
                        updateIngredientField(i, 'amount', e.target.value)
                      }
                      placeholder="e.g., 2"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`unit-${i}`}>Unit:</Label>
                    <Input
                      id={`unit-${i}`}
                      name={`unit-${i}`}
                      required
                      value={ing.unit}
                      onChange={(e) =>
                        updateIngredientField(i, 'unit', e.target.value)
                      }
                      placeholder="e.g., cups"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`notes-${i}`}>Notes:</Label>
                    <Input
                      type="text"
                      id={`notes-${i}`}
                      name={`notes-${i}`}
                      value={ing.notes}
                      onChange={(e) =>
                        updateIngredientField(i, 'notes', e.target.value)
                      }
                      placeholder="Optional notes"
                    />
                  </div>
                </div>
                {formErrors.ingredients && (
                  <p className="text-red-500">{formErrors.ingredients}</p>
                )}
              </div>
            ))}
            <Button
              type="button"
              onClick={addIngredientField}
              className="px-4 py-2 bg-button-blue hover:bg-button-blue-hover"
            >
              Add Ingredient
            </Button>
          </fieldset>

          {/* Servings */}
          <div>
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
              placeholder="Enter number of servings"
            />
            {formErrors.servings && (
              <p className="text-red-500">{formErrors.servings}</p>
            )}
          </div>

          {/* Prep Time */}
          <div>
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
              placeholder="Enter prep time in minutes"
            />
            {formErrors.prepTime && (
              <p className="text-red-500">{formErrors.prepTime}</p>
            )}
          </div>

          {/* Cook Time */}
          <div>
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
              placeholder="Enter cook time in minutes"
            />
            {formErrors.cookTime && (
              <p className="text-red-500">{formErrors.cookTime}</p>
            )}
          </div>

          {/* Meal Time */}
          <div>
            <Label htmlFor="recipeMealTime">Meal Time:</Label>
            <Select
              id="recipeMealTime"
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

          {/* Cuisine */}
          <div>
            <Label htmlFor="recipeCuisine">Cuisine:</Label>
            <Select
              id="recipeCuisine"
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

          {/* Calories */}
          <div>
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
              placeholder="Enter calories"
            />
          </div>

          {/* Tags */}
          <div>
            <Label htmlFor="recipeTags">Tags (comma-separated):</Label>
            <Input
              type="text"
              id="recipeTags"
              name="tags"
              value={formData.tags}
              onChange={(e) =>
                setFormData({ ...formData, tags: e.target.value })
              }
              placeholder="e.g., spicy, vegan"
            />
          </div>

          {/* Is Public */}
          <div>
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

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full py-3 bg-button-blue hover:bg-button-blue-hover"
          >
            Create Recipe
          </Button>
        </form>
      </main>
    </>
  );
}
