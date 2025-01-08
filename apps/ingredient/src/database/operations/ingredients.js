const mongoose = require('mongoose');
const Recipe = require('../models/recipe');

// Function to get the most common recipes that use a specific ingredient
const getMostCommonRecipesForIngredient = async (ingredientId) => {
  try {
    // Aggregation pipeline to find the most common recipes for the ingredient
    const result = await Recipe.aggregate([
      // Match recipes that contain the specified ingredient in the 'ingredients' array
      {
        $match: {
          'ingredients.ingredientId': mongoose.Types.ObjectId(ingredientId),
        },
      },
      // Unwind the 'ingredients' array so that each ingredient becomes its own document
      {
        $unwind: '$ingredients',
      },
      // Match again to filter for the specific ingredient
      {
        $match: {
          'ingredients.ingredientId': mongoose.Types.ObjectId(ingredientId),
        },
      },
      // Group by recipe ID and count the occurrences of the ingredient in each recipe
      {
        $group: {
          _id: '$_id', // Group by recipe ID
          name: { $first: '$name' }, // Include the name of the recipe
          count: { $sum: 1 }, // Count the occurrences of the ingredient in the recipe
        },
      },
      // Sort by the count in descending order to get the most common recipes first
      {
        $sort: { count: -1 },
      },
      // Limit the result to the top 10 recipes (optional)
      {
        $limit: 10,
      },
    ]);

    // Return the result of the aggregation
    return result;
  } catch (error) {
    // Log the error if something goes wrong
    console.error('Error fetching common recipes:', error);
    throw error; // Rethrow the error to be handled by the calling function
  }
};

// Export the function so it can be used elsewhere in the application
module.exports = {
  getMostCommonRecipesForIngredient,
};
