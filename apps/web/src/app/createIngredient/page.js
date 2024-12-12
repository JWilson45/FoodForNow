'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name.trim());
    if (formData.description) {
      formDataToSend.append('description', formData.description.trim());
    }
    if (formData.calories) {
      formDataToSend.append('calories', formData.calories);
    }
    if (formData.image) {
      formDataToSend.append('image', formData.image);
    }

    const nutritionalInfo = {};
    Object.entries(formData.nutritionalInfo).forEach(([key, value]) => {
      if (value) nutritionalInfo[key] = parseFloat(value);
    });
    if (Object.keys(nutritionalInfo).length > 0) {
      formDataToSend.append('nutritionalInfo', JSON.stringify(nutritionalInfo));
    }

    try {
      const res = await fetch(`${config.apiBaseUrl}/ingredients`, {
        method: 'POST',
        credentials: 'include',
        body: formDataToSend,
      });

      if (res.ok) {
        addToast({
          title: 'Success',
          description: 'Ingredient created successfully!',
        });
        router.push('/ingredients');
      } else if (res.status === 401) {
        addToast({
          title: 'Error',
          description: 'You must be logged in to create an ingredient.',
          variant: 'destructive',
        });
        router.push('/signin');
      } else {
        const errData = await res.json();
        addToast({
          title: 'Error',
          description:
            errData.error || 'An error occurred while creating the ingredient.',
          variant: 'destructive',
        });
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
      <Navbar />
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
