const { Schema, model } = require('mongoose');

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
      type: Buffer, // Or URL if scalability is a concern
      required: false,
    },
    nutritionalInfo: {
      fat: { type: Number },
      protein: { type: Number },
      carbohydrates: { type: Number },
      fiber: { type: Number },
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt
  }
);

const Ingredient = model('Ingredient', IngredientSchema);

module.exports = Ingredient;
