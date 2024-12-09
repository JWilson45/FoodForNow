'use client';

import Head from 'next/head';
import { useState } from 'react';
import Label from '@/components/Label';
import Input from '@/components/Input';
import Textarea from '@/components/Textarea';
import Checkbox from '@/components/Checkbox';
import Button from '@/components/Button';
import ProgressBar from '@/components/ProgressBar';

export default function CreateIngredient() {
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
  const [progress, setProgress] = useState(0);
  const [strength, setStrength] = useState('weak');

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
      setProgress(0);
      setStrength('weak');
    } else {
      const err = await res.json();
      alert(err.error || 'An error occurred.');
    }
  };

  const handleNutritionToggle = () => {
    setNutritionVisible(!nutritionVisible);
  };

  const handlePasswordStrength = (value) => {
    // Example logic for progress and strength based on input value
    const len = value.length;
    if (len < 4) {
      setProgress(25);
      setStrength('weak');
    } else if (len < 8) {
      setProgress(50);
      setStrength('medium');
    } else if (len < 12) {
      setProgress(75);
      setStrength('strong');
    } else {
      setProgress(100);
      setStrength('very-strong');
    }
  };

  return (
    <>
      <Head>
        <title>Create Ingredient</title>
      </Head>
      <main className="flex justify-center items-center p-6 bg-gray-900 min-h-screen">
        <form
          id="ingredientForm"
          onSubmit={handleSubmit}
          aria-labelledby="formTitle"
          className="w-full max-w-lg bg-black/80 border-2 border-button-blue rounded-xl p-8 shadow-custom animate-fadeIn space-y-6"
        >
          <h2
            id="formTitle"
            className="text-2xl font-bold text-center text-white"
          >
            Create Ingredient
          </h2>

          {/* Name */}
          <div>
            <Label htmlFor="ingredientName">Name:</Label>
            <Input
              id="ingredientName"
              name="name"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Enter ingredient name"
            />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="ingredientDescription">Description:</Label>
            <Textarea
              id="ingredientDescription"
              name="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Enter ingredient description"
            />
          </div>

          {/* Calories */}
          <div>
            <Label htmlFor="ingredientCalories">Calories:</Label>
            <Input
              type="number"
              id="ingredientCalories"
              name="calories"
              min="0"
              value={formData.calories}
              onChange={(e) =>
                setFormData({ ...formData, calories: e.target.value })
              }
              placeholder="Enter calories"
            />
          </div>

          {/* Image */}
          <div>
            <Label htmlFor="ingredientImage">Image:</Label>
            <input
              type="file"
              id="ingredientImage"
              name="image"
              accept="image/*"
              className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-button-blue file:text-white hover:file:bg-button-blue-hover"
            />
          </div>

          {/* Nutritional Information */}
          <fieldset className="space-y-4">
            <legend className="flex items-center space-x-2">
              <Checkbox
                id="toggleNutritionFacts"
                name="toggleNutritionFacts"
                checked={nutritionVisible}
                onChange={handleNutritionToggle}
                label="Nutritional Information"
              />
            </legend>
            {nutritionVisible && (
              <div className="space-y-4">
                <Label htmlFor="ingredientFat">Fat (g):</Label>
                <Input
                  type="number"
                  id="ingredientFat"
                  name="fat"
                  min="0"
                  value={formData.fat}
                  onChange={(e) =>
                    setFormData({ ...formData, fat: e.target.value })
                  }
                  placeholder="Enter fat content"
                />

                <Label htmlFor="ingredientProtein">Protein (g):</Label>
                <Input
                  type="number"
                  id="ingredientProtein"
                  name="protein"
                  min="0"
                  value={formData.protein}
                  onChange={(e) =>
                    setFormData({ ...formData, protein: e.target.value })
                  }
                  placeholder="Enter protein content"
                />

                <Label htmlFor="ingredientCarbohydrates">
                  Carbohydrates (g):
                </Label>
                <Input
                  type="number"
                  id="ingredientCarbohydrates"
                  name="carbohydrates"
                  min="0"
                  value={formData.carbohydrates}
                  onChange={(e) =>
                    setFormData({ ...formData, carbohydrates: e.target.value })
                  }
                  placeholder="Enter carbohydrates content"
                />

                <Label htmlFor="ingredientFiber">Fiber (g):</Label>
                <Input
                  type="number"
                  id="ingredientFiber"
                  name="fiber"
                  min="0"
                  value={formData.fiber}
                  onChange={(e) =>
                    setFormData({ ...formData, fiber: e.target.value })
                  }
                  placeholder="Enter fiber content"
                />
              </div>
            )}
          </fieldset>

          {/* Progress Bar */}
          <div>
            <ProgressBar value={progress} strength={strength} />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full py-3 bg-button-blue hover:bg-button-blue-hover"
          >
            Add Ingredient
          </Button>
        </form>
      </main>
    </>
  );
}
