const { Schema, model } = require('mongoose');

// Create the Mongoose schema for Ingredient
const IngredientSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    calories: {
      type: Number,
    },
    image: {
      type: Buffer,
      trim: true,
    },
    unit: {
      type: String,
      trim: true,
      // enum: ['grams', 'cups', 'tablespoons', 'teaspoons', 'pieces', 'other'],
    },
    nutritionalInfo: {
      fat: { type: Number },
      protein: { type: Number },
      carbohydrates: { type: Number },
      fiber: { type: Number },
    },
  },
  {
    timestamps: true,
  }
);

const Ingredient = model('Ingredient', IngredientSchema);

module.exports = Ingredient;
