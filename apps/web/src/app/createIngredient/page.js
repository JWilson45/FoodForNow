// /src/app/createIngredient/page.js

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UIButton as Button } from '@/components/ui/button'; // Corrected Import
import { Input } from '@/components/ui/input'; // Named export
import Label from '@/components/ui/label'; // Default export
import { Textarea } from '@/components/ui/textarea'; // Named export
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'; // Named exports
import { useToast } from '@/components/ui/use-toast';
import config from '@/config';

export default function CreateIngredient() {
  const router = useRouter();
  const { addToast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    calories: '',
    image: null,
    nutritionalInfo: {
      fat: '',
      protein: '',
      carbohydrates: '',
      fiber: '',
    },
  });
  const [formErrors, setFormErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name in formData.nutritionalInfo) {
      setFormData((prev) => ({
        ...prev,
        nutritionalInfo: {
          ...prev.nutritionalInfo,
          [name]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, image: file }));
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = 'Name is required and cannot be empty.';
    }

    // Validate calories only if it's provided
    if (formData.calories.trim() && isNaN(Number(formData.calories))) {
      errors.calories = 'Calories must be a valid number.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const payload = {
      name: formData.name.trim(),
      description: formData.description.trim() || null,
      ...(formData.calories.trim() && { calories: Number(formData.calories) }),
      nutritionalInfo: {},
    };

    Object.entries(formData.nutritionalInfo).forEach(([key, value]) => {
      if (value) {
        payload.nutritionalInfo[key] = parseFloat(value);
      }
    });

    try {
      const res = await fetch(`${config.apiBaseUrl}/ingredients`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        addToast({
          title: 'Success',
          description: 'Ingredient created successfully!',
        });
        setFormData({
          name: '',
          description: '',
          calories: '',
          image: null,
          nutritionalInfo: {
            fat: '',
            protein: '',
            carbohydrates: '',
            fiber: '',
          },
        });
        document.getElementById('name').focus();
      } else {
        const errData = await res.json();
        if (errData.errors && Array.isArray(errData.errors)) {
          const errorMessages = errData.errors
            .map((err) => `${err.field}: ${err.message}`)
            .join('\n');
          addToast({
            title: 'Error',
            description: errorMessages,
            variant: 'destructive',
          });
        } else {
          addToast({
            title: 'Error',
            description:
              errData.error ||
              'An error occurred while creating the ingredient.',
            variant: 'destructive',
          });
        }
      }
    } catch (error) {
      console.error('Error creating ingredient:', error);
      addToast({
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-2xl mx-auto py-6 sm:px-6 lg:px-8">
        <Card>
          <CardHeader>
            <CardTitle>Create New Ingredient</CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
                {formErrors.name && (
                  <p className="text-red-500 text-sm">{formErrors.name}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="calories">Calories</Label>
                <Input
                  id="calories"
                  name="calories"
                  type="number"
                  value={formData.calories}
                  onChange={handleInputChange}
                />
                {formErrors.calories && (
                  <p className="text-red-500 text-sm">{formErrors.calories}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="image">Image</Label>
                <Input
                  id="image"
                  name="image"
                  type="file"
                  onChange={handleImageChange}
                  accept="image/*"
                />
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">
                  Nutritional Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fat">Fat (g)</Label>
                    <Input
                      id="fat"
                      name="fat"
                      type="number"
                      value={formData.nutritionalInfo.fat}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="protein">Protein (g)</Label>
                    <Input
                      id="protein"
                      name="protein"
                      type="number"
                      value={formData.nutritionalInfo.protein}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="carbohydrates">Carbohydrates (g)</Label>
                    <Input
                      id="carbohydrates"
                      name="carbohydrates"
                      type="number"
                      value={formData.nutritionalInfo.carbohydrates}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fiber">Fiber (g)</Label>
                    <Input
                      id="fiber"
                      name="fiber"
                      type="number"
                      value={formData.nutritionalInfo.fiber}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit">Create Ingredient</Button>
            </CardFooter>
          </form>
        </Card>
      </main>
    </div>
  );
}
