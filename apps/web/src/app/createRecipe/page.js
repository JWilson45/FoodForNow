'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Textarea } from '@/components/ui/Textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select';
import { Checkbox } from '@/components/ui/Checkbox';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card';
import IngredientSelect from '@/components/IngredientSelect'; // Using default export
import config from '@/config';

export default function CreateRecipe() {
  const router = useRouter();
  const { addToast } = useToast();
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
      const res = await fetch(`${config.apiBaseUrl}/recipes`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        addToast({
          title: 'Success',
          description: 'Recipe created successfully!',
        });
        router.push('/cookbook');
      } else if (res.status === 401) {
        addToast({
          title: 'Error',
          description: 'You must be logged in to create a recipe.',
          variant: 'destructive',
        });
        router.push('/signin');
      } else if (res.status === 409) {
        addToast({
          title: 'Error',
          description: 'Recipe already exists.',
          variant: 'destructive',
        });
      } else {
        const errData = await res.json();
        if (errData.errors && Array.isArray(errData.errors)) {
          addToast({
            title: 'Error',
            description: errData.errors
              .map((error) => `${error.field}: ${error.message}`)
              .join('\n'),
            variant: 'destructive',
          });
        } else {
          addToast({
            title: 'Error',
            description:
              errData.error || 'An error occurred while creating the recipe.',
            variant: 'destructive',
          });
        }
      }
    } catch (error) {
      console.error('Error creating recipe:', error);
      addToast({
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="container mx-auto py-6">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Create Recipe</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="recipeName">Name</Label>
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
              {formErrors.name && (
                <p className="text-sm text-red-500">{formErrors.name}</p>
              )}
            </div>

            {/* Alias */}
            <div className="space-y-2">
              <Label htmlFor="recipeAlias">Alias</Label>
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
            <div className="space-y-2">
              <Label htmlFor="recipeDescription">Description</Label>
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
            <div className="space-y-4">
              <Label>Instructions</Label>
              {instructions.map((inst, i) => (
                <div key={i} className="flex items-center space-x-2">
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
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeInstruction(i)}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              ))}
              {formErrors.instructions && (
                <p className="text-sm text-red-500">
                  {formErrors.instructions}
                </p>
              )}
              <Button type="button" onClick={addInstruction} variant="outline">
                Add Instruction
              </Button>
            </div>

            {/* Ingredients */}
            <div className="space-y-4">
              <Label>Ingredients</Label>
              {ingredients.map((ing, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <IngredientSelect
                      onSelect={(selected) =>
                        handleIngredientSelect(i, selected)
                      }
                      name={`ingredient-${i}`}
                      required
                    />
                    {ingredients.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeIngredientField(i)}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`amount-${i}`}>Amount</Label>
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
                    <div className="space-y-2">
                      <Label htmlFor={`unit-${i}`}>Unit</Label>
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
                    <div className="space-y-2">
                      <Label htmlFor={`notes-${i}`}>Notes</Label>
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
                </div>
              ))}
              {formErrors.ingredients && (
                <p className="text-sm text-red-500">{formErrors.ingredients}</p>
              )}
              <Button
                type="button"
                onClick={addIngredientField}
                variant="outline"
              >
                Add Ingredient
              </Button>
            </div>

            {/* Servings */}
            <div className="space-y-2">
              <Label htmlFor="recipeServings">Servings</Label>
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
                <p className="text-sm text-red-500">{formErrors.servings}</p>
              )}
            </div>

            {/* Prep Time */}
            <div className="space-y-2">
              <Label htmlFor="recipePrepTime">Prep Time (minutes)</Label>
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
                <p className="text-sm text-red-500">{formErrors.prepTime}</p>
              )}
            </div>

            {/* Cook Time */}
            <div className="space-y-2">
              <Label htmlFor="recipeCookTime">Cook Time (minutes)</Label>
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
                <p className="text-sm text-red-500">{formErrors.cookTime}</p>
              )}
            </div>

            {/* Meal Time */}
            <div className="space-y-2">
              <Label htmlFor="recipeMealTime">Meal Time</Label>
              <Select
                value={formData.mealTime}
                onValueChange={(value) =>
                  setFormData({ ...formData, mealTime: value })
                }
              >
                <SelectTrigger id="recipeMealTime">
                  <SelectValue placeholder="Select meal time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="breakfast">Breakfast</SelectItem>
                  <SelectItem value="lunch">Lunch</SelectItem>
                  <SelectItem value="dinner">Dinner</SelectItem>
                  <SelectItem value="snack">Snack</SelectItem>
                  <SelectItem value="dessert">Dessert</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Cuisine */}
            <div className="space-y-2">
              <Label htmlFor="recipeCuisine">Cuisine</Label>
              <Select
                value={formData.cuisine}
                onValueChange={(value) =>
                  setFormData({ ...formData, cuisine: value })
                }
              >
                <SelectTrigger id="recipeCuisine">
                  <SelectValue placeholder="Select cuisine" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="italian">Italian</SelectItem>
                  <SelectItem value="chinese">Chinese</SelectItem>
                  <SelectItem value="mexican">Mexican</SelectItem>
                  <SelectItem value="indian">Indian</SelectItem>
                  <SelectItem value="american">American</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Calories */}
            <div className="space-y-2">
              <Label htmlFor="recipeCalories">Calories</Label>
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
            <div className="space-y-2">
              <Label htmlFor="recipeTags">Tags (comma-separated)</Label>
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
            <div className="flex items-center space-x-2">
              <Checkbox
                id="recipeIsPublic"
                checked={formData.isPublic}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, isPublic: checked })
                }
              />
              <Label htmlFor="recipeIsPublic">Make Public</Label>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              Create Recipe
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
