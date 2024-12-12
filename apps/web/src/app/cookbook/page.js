'use client';

import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import config from '@/config';

export default function Cookbook() {
  const [recipes, setRecipes] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const router = useRouter();
  const { addToast } = useToast();

  // fetchRecipes is now stable because addToast is stable
  const fetchRecipes = useCallback(async () => {
    try {
      const res = await fetch(`${config.apiBaseUrl}/recipes`, {
        credentials: 'include',
      });
      if (!res.ok) {
        throw new Error(`Error fetching recipes: ${res.statusText}`);
      }
      const data = await res.json();
      setRecipes(data.recipes || []);
    } catch (err) {
      console.error('Error fetching recipes:', err);
      addToast({
        title: 'Error',
        description: 'Failed to fetch recipes. Please try again.',
        variant: 'destructive',
      });
    }
  }, [addToast]);

  useEffect(() => {
    fetchRecipes();
    // Empty dependency array since fetchRecipes is stable
  }, [fetchRecipes]);

  const pageVariants = {
    initial: (direction) => ({
      opacity: 0,
      x: direction > 0 ? '100%' : '-100%',
    }),
    in: {
      opacity: 1,
      x: 0,
    },
    out: (direction) => ({
      opacity: 0,
      x: direction < 0 ? '100%' : '-100%',
    }),
  };

  const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.5,
  };

  const handlePageTurn = (direction) => {
    setCurrentPage((prevPage) => {
      const newPage = prevPage + direction;
      return Math.max(0, Math.min(newPage, recipes.length - 1));
    });
  };

  return (
    <div className="container mx-auto py-6 min-h-screen flex flex-col">
      <h1 className="text-3xl font-bold mb-6 text-center">My Cookbook</h1>
      <div className="flex-grow flex items-center justify-center">
        <div className="w-full max-w-4xl aspect-[3/2] bg-background border-2 border-primary rounded-lg shadow-lg overflow-hidden relative">
          <div className="absolute inset-0 bg-[url('/paper-texture.jpg')] opacity-10 pointer-events-none" />
          <AnimatePresence initial={false} custom={currentPage}>
            <motion.div
              key={currentPage}
              custom={currentPage}
              variants={pageVariants}
              initial="initial"
              animate="in"
              exit="out"
              transition={pageTransition}
              className="absolute inset-0 p-8 flex"
            >
              {recipes.length > 0 ? (
                <RecipeCard recipe={recipes[currentPage]} />
              ) : (
                <div className="flex items-center justify-center w-full h-full text-center text-gray-500">
                  No recipes found. Add some recipes to your cookbook!
                </div>
              )}
            </motion.div>
          </AnimatePresence>
          <div className="absolute bottom-4 left-4 right-4 flex justify-between">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageTurn(-1)}
              disabled={currentPage === 0}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageTurn(1)}
              disabled={currentPage === recipes.length - 1}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      <div className="mt-6 text-center">
        <Button onClick={() => router.push('/create-recipe')}>
          Add New Recipe
        </Button>
      </div>
    </div>
  );
}

function RecipeCard({ recipe }) {
  return (
    <Card className="w-full h-full overflow-auto bg-transparent">
      <CardHeader>
        <CardTitle>{recipe.name}</CardTitle>
        <CardDescription>
          Servings: {recipe.servings} | Prep: {recipe.prepTime} min | Cook:{' '}
          {recipe.cookTime} min
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold mb-2">Ingredients:</h3>
          <ul className="list-disc list-inside">
            {recipe.ingredients.map((ing, index) => (
              <li key={index}>
                {ing.amount} {ing.unit} of {ing.ingredientId}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Instructions:</h3>
          <ol className="list-decimal list-inside">
            {recipe.instructions.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ol>
        </div>
        {recipe.description && (
          <div>
            <h3 className="font-semibold mb-2">Description:</h3>
            <p>{recipe.description}</p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button
          variant="outline"
          className="w-full"
          onClick={() =>
            (window.location.href = `/viewRecipe?id=${recipe._id}`)
          }
        >
          View Full Recipe
        </Button>
      </CardFooter>
    </Card>
  );
}

RecipeCard.propTypes = {
  recipe: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    servings: PropTypes.number.isRequired,
    prepTime: PropTypes.number.isRequired,
    cookTime: PropTypes.number.isRequired,
    ingredients: PropTypes.arrayOf(
      PropTypes.shape({
        ingredientId: PropTypes.string.isRequired,
        amount: PropTypes.number.isRequired,
        unit: PropTypes.string.isRequired,
        notes: PropTypes.string,
      })
    ).isRequired,
    instructions: PropTypes.arrayOf(PropTypes.string).isRequired,
    description: PropTypes.string,
  }).isRequired,
};
