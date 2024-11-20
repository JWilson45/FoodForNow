const Ingredient = require('../services/database/models/ingredient');

/**************************************************
 *
 *                  Get Ingredient
 *
 ***************************************************/
exports.getIngredient = async function (_, res) {
  try {
    const ingredientList = await Ingredient.find({});
    res.status(200).json(ingredientList);
  } catch (error) {
    console.error('Error fetching ingredients:', error);
    res.status(500).json({ message: 'Error fetching ingredients' });
  }
};

/**************************************************
 *
 *               Create New Ingredient
 *
 ***************************************************/
exports.createIngredient = async function (req, res) {
  const body = req.body;

  if (!body || !body.name) {
    return res.status(400).json({ message: 'Ingredient name is required.' });
  }

  const newIngredient = new Ingredient({
    name: body.name,
    description: body.description || '',
    calories: body.calories || 0,
    image: body.image || null,
  });

  try {
    const result = await newIngredient.save();
    res.status(201).json(result);
  } catch (error) {
    console.error('Error creating ingredient:', error);
    res.status(500).json({ message: 'Error creating ingredient' });
  }
};

/**************************************************
 *
 *                    Test Route
 *
 ***************************************************/
exports.test = function (_, res) {
  res
    .status(200)
    .send('Hello from the default exported thing to make things super simple');
};
