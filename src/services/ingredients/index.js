const Ingredient = require('../database/models/ingredient');
const {
  ingredientValidationSchema,
} = require('../../routes/ingredient/validator');

const createIngredient = async (req, res) => {
  try {
    // Validate the request body using Joi
    const { error, value } = ingredientValidationSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      // Collect all validation errors
      const errors = error.details.map((detail) => ({
        field: detail.context.key,
        message: detail.message,
      }));
      return res.status(400).json({ errors });
    }

    // Destructure validated data
    const { name, description, calories, image, nutritionalInfo } = value;

    // Create a new ingredient instance
    const newIngredient = new Ingredient({
      name,
      description,
      calories,
      image,
      nutritionalInfo,
    });

    // Save the ingredient to the database
    await newIngredient.save();

    // Return success response
    res.status(201).json({
      message: 'Ingredient created successfully',
      ingredient: {
        id: newIngredient._id,
        name: newIngredient.name,
        description: newIngredient.description,
        calories: newIngredient.calories,
        nutritionalInfo: newIngredient.nutritionalInfo,
        createdAt: newIngredient.createdAt,
        updatedAt: newIngredient.updatedAt,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        error: 'Ingredient already exists',
        keyPattern: error.keyPattern,
      });
    }

    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }

    console.error(error);
    res.status(500).json({
      error: 'An unexpected error occurred while creating the ingredient',
    });
  }
};

module.exports = { createIngredient };
