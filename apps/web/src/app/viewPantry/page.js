'use client';

import { useState, useEffect } from 'react';
import Card from '@/components/Card';
import { Loader2 } from 'lucide-react';

// Assuming you have a config file with the API base URL
import config from '@/config';

export default function IngredientsPage() {
  const [ingredients, setIngredients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchIngredients() {
      try {
        const response = await fetch(`${config.apiBaseUrl}/myIngredients`);
        if (!response.ok) {
          throw new Error('Failed to fetch ingredients');
        }
        const data = await response.json();
        setIngredients(data);
      } catch (err) {
        setError('Error fetching ingredients. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    }

    fetchIngredients();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-white">
        My Cupboard Ingredients
      </h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {ingredients.map((ingredient) => (
          <Card key={ingredient.id} title={ingredient.name}>
            <p className="text-sm text-gray-300">
              {ingredient.quantity} {ingredient.unit}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}
