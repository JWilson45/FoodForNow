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
      type: Buffer, // Store image data as binary
    },
    quantity: {
      type: Number,
      default: 1,
    },
    unit: {
      type: String,
      trim: true,
    },
    nutritionalInfo: {
      fat: { type: Number },
      protein: { type: Number },
      carbohydrates: { type: Number },
      fiber: { type: Number },
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

// Create and export the model
const Ingredient = model('Ingredient', IngredientSchema);

module.exports = Ingredient;
