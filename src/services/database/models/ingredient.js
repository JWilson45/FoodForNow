const { Schema, model } = require('mongoose');

const IngredientSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      trim: true,
      required: false,
    },
    calories: {
      type: Number,
      required: false,
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
