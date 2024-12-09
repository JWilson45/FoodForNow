import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function RecipePage() {
  const [recipe, setRecipe] = useState(null);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (!id) return;
    fetch(`/api/recipes/${id}`, { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => setRecipe(data.recipe || null))
      .catch((err) => console.error('Error fetching recipe:', err));
  }, [id]);

  return (
    <>
      <Head>
        <title>Recipe Details</title>
      </Head>
      <main id="recipeDetails" className="container">
        {!recipe ? (
          <p>Loading or no recipe found.</p>
        ) : (
          <>
            <h2>{recipe.name}</h2>
            <p>
              <strong>Description:</strong>{' '}
              {recipe.description || 'No description provided.'}
            </p>
            <p>
              <strong>Servings:</strong> {recipe.servings}
            </p>
            <p>
              <strong>Prep Time:</strong> {recipe.prepTime} minutes
            </p>
            <p>
              <strong>Cook Time:</strong> {recipe.cookTime} minutes
            </p>
            <p>
              <strong>Ingredients:</strong>
            </p>
            <ul>
              {recipe.ingredients.map((ing, i) => (
                <li key={i}>
                  {ing.amount} {ing.unit} of Ingredient ID {ing.ingredientId}
                </li>
              ))}
            </ul>
            <p>
              <strong>Instructions:</strong>
            </p>
            <ol>
              {recipe.instructions.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
            <p>
              <strong>Tags:</strong>{' '}
              {recipe.tags?.join(', ') || 'No tags provided.'}
            </p>
            <button onClick={() => router.back()}>Back to Cookbook</button>
          </>
        )}
      </main>
    </>
  );
}
