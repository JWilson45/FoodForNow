const Meal = require("../models/meal");

/**************************************************
 *
 *                    Get Meal
 *
***************************************************/
exports.getMeal = async function (req, res) {
  try {
    const mealList = await Meal.find({});
    res.status(200).json(mealList);
  } catch (error) {
    console.error("Error fetching meals:", error);
    res.status(500).json({ message: "Error fetching meals" });
  }
};

/**************************************************
 *
 *                    Test Route
 *
***************************************************/
exports.test = function (req, res) {
  res.status(200).send("Hello from the default exported thing to make things super simple");
};
