import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function EditMeal() {
  const router = useRouter();
  const { id: mealId } = router.query;

  const [recipes, setRecipes] = useState([]);
  const [recipeInputs, setRecipeInputs] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    mealTime: '',
    servings: '',
    calories: '',
    tags: '',
    isVegetarian: false,
    isVegan: false,
    cuisine: '',
  });

  useEffect(() => {
    if (!mealId) return;
    Promise.all([
      fetch(`/api/meals/${mealId}`, { credentials: 'include' }).then((r) =>
        r.json()
      ),
      fetch('/api/recipes', { credentials: 'include' }).then((r) => r.json()),
    ])
      .then(([mealData, recipesData]) => {
        const meal = mealData.meal;
        setRecipes(recipesData.recipes || []);
        setFormData({
          name: meal.name || '',
          description: meal.description || '',
          mealTime: meal.mealTime || '',
          servings: meal.servings.toString() || '',
          calories: meal.calories?.toString() || '',
          tags: meal.tags?.join(', ') || '',
          isVegetarian: meal.isVegetarian || false,
          isVegan: meal.isVegan || false,
          cuisine: meal.cuisine || '',
        });
        if (meal.recipes && meal.recipes.length > 0) {
          setRecipeInputs(
            meal.recipes.map((r) => ({ name: r.name, id: r._id }))
          );
        } else {
          setRecipeInputs([{ name: '', id: '' }]);
        }
      })
      .catch((err) => {
        console.error('Error:', err);
        alert('Error fetching meal details. Redirecting to meals page.');
        window.location.href = 'viewMeals';
      });
  }, [mealId]);

  const addRecipeField = () => {
    setRecipeInputs((prev) => [...prev, { name: '', id: '' }]);
  };

  const removeRecipeField = (index) => {
    setRecipeInputs((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRecipeChange = (index, value) => {
    const lowerVal = value.trim().toLowerCase();
    const matched = recipes.find((r) => r.name.toLowerCase() === lowerVal);
    setRecipeInputs((prev) => {
      const copy = [...prev];
      copy[index] = { name: value, id: matched?._id || '' };
      return copy;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!mealId) return;

    // Validate recipe IDs
    for (let r of recipeInputs) {
      if (!r.id || !/^[a-fA-F0-9]{24}$/.test(r.id)) {
        alert('One or more recipes are invalid.');
        return;
      }
    }

    const tagsArray = formData.tags
      ? formData.tags.split(',').map((t) => t.trim())
      : undefined;
    const data = {
      name: formData.name.trim(),
      description: formData.description.trim() || undefined,
      recipes: recipeInputs.map((r) => r.id),
      mealTime: formData.mealTime || undefined,
      servings: parseInt(formData.servings),
      calories: formData.calories ? parseFloat(formData.calories) : undefined,
      tags: tagsArray,
      isVegetarian: formData.isVegetarian,
      isVegan: formData.isVegan,
      cuisine: formData.cuisine || undefined,
    };

    const res = await fetch(`/api/meals/${mealId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include',
    });

    if (res.ok) {
      alert('Meal updated successfully!');
      window.location.href = 'viewMeals';
    } else {
      const errData = await res.json();
      alert(errData.error || 'An error occurred while updating the meal.');
    }
  };

  return (
    <>
      <Head>
        <title>Edit Meal</title>
      </Head>
      <main className="form-container">
        <form
          id="editMealForm"
          className="meal-form"
          aria-labelledby="formTitle"
          onSubmit={handleSubmit}
        >
          <h2 id="formTitle">Edit Meal</h2>
          <div className="form-group">
            <label htmlFor="mealName">Name:</label>
            <input
              type="text"
              id="mealName"
              name="name"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>
          <div className="form-group">
            <label htmlFor="mealDescription">Description:</label>
            <textarea
              id="mealDescription"
              name="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            ></textarea>
          </div>
          <fieldset className="form-group">
            <legend>Recipes:</legend>
            <div id="recipesContainer">
              {recipeInputs.map((ri, i) => (
                <div className="recipe-item" key={i}>
                  <label htmlFor={`recipeName${i + 1}`}>Recipe {i + 1}:</label>
                  <input
                    type="text"
                    id={`recipeName${i + 1}`}
                    required
                    value={ri.name}
                    onChange={(e) => handleRecipeChange(i, e.target.value)}
                    list={`recipesDatalist${i + 1}`}
                  />
                  <datalist id={`recipesDatalist${i + 1}`}>
                    {recipes.map((r) => (
                      <option key={r._id} value={r.name}></option>
                    ))}
                  </datalist>
                  <button
                    type="button"
                    className="removeRecipeButton"
                    onClick={() => removeRecipeField(i)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              id="addRecipeButton"
              className="btn btn-secondary"
              onClick={addRecipeField}
            >
              Add Recipe
            </button>
          </fieldset>
          <div className="form-group">
            <label htmlFor="mealMealTime">Meal Time:</label>
            <select
              id="mealMealTime"
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
          </div>
          <div className="form-group">
            <label htmlFor="mealServings">Servings:</label>
            <input
              type="number"
              id="mealServings"
              name="servings"
              min="1"
              required
              value={formData.servings}
              onChange={(e) =>
                setFormData({ ...formData, servings: e.target.value })
              }
            />
          </div>
          <div className="form-group">
            <label htmlFor="mealCalories">Calories:</label>
            <input
              type="number"
              id="mealCalories"
              name="calories"
              min="0"
              value={formData.calories}
              onChange={(e) =>
                setFormData({ ...formData, calories: e.target.value })
              }
            />
          </div>
          <div className="form-group">
            <label htmlFor="mealTags">Tags (comma-separated):</label>
            <input
              type="text"
              id="mealTags"
              name="tags"
              value={formData.tags}
              onChange={(e) =>
                setFormData({ ...formData, tags: e.target.value })
              }
            />
          </div>
          <div className="form-group checkbox-group">
            <label htmlFor="mealIsVegetarian">Is Vegetarian:</label>
            <input
              type="checkbox"
              id="mealIsVegetarian"
              name="isVegetarian"
              checked={formData.isVegetarian}
              onChange={(e) =>
                setFormData({ ...formData, isVegetarian: e.target.checked })
              }
            />
          </div>
          <div className="form-group checkbox-group">
            <label htmlFor="mealIsVegan">Is Vegan:</label>
            <input
              type="checkbox"
              id="mealIsVegan"
              name="isVegan"
              checked={formData.isVegan}
              onChange={(e) =>
                setFormData({ ...formData, isVegan: e.target.checked })
              }
            />
          </div>
          <div className="form-group">
            <label htmlFor="mealCuisine">Cuisine:</label>
            <select
              id="mealCuisine"
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
          </div>
          <button type="submit" id="submitMeal" className="btn btn-primary">
            Update Meal
          </button>
        </form>
      </main>
    </>
  );
}
