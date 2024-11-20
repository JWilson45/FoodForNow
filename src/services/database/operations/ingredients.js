const mongoose = require('mongoose');
const Recipe = require('../models/recipe');

async function getMostCommonRecipesForIngredient(ingredientId) {
  try {
    const result = await Recipe.aggregate([
      {
        $match: {
          'ingredients.ingredientId': mongoose.Types.ObjectId(ingredientId),
        },
      },
      {
        $unwind: '$ingredients',
      },
      {
        $match: {
          'ingredients.ingredientId': mongoose.Types.ObjectId(ingredientId),
        },
      },
      {
        $group: {
          _id: '$_id',
          name: { $first: '$name' },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 }, // Sort by usage count in descending order
      },
      {
        $limit: 10, // Limit to the top 10 recipes (optional)
      },
    ]);

    return result;
  } catch (error) {
    console.error('Error fetching common recipes:', error);
    throw error;
  }
}

module.exports = {
  getMostCommonRecipesForIngredient,
};
