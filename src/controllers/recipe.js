const Recipe = require("../models/recipe");

/**************************************************
 *
 *                    Get Recipe
 *
***************************************************/
exports.getRecipe = async function (_, res) {
  try {
    const recipeList = await Recipe.find({});
    res.status(200).json(recipeList);
  } catch (error) {
    console.error("Error fetching recipes:", error);
    res.status(500).json({ message: "Error fetching recipes" });
  }
};

/**************************************************
 *
 *                    Test Route
 *
***************************************************/
exports.test = function (_, res) {
  res.status(200).send("Hello from the default exported thing to make things super simple");
};
