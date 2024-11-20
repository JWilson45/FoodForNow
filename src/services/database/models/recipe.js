const { Schema, model, Types } = require('mongoose');

// Import Ingredient schema (assuming it's defined in ingredient.js)
const Ingredient = require('./ingredient');

// Create the Mongoose schema for Recipe
const RecipeSchema = new Schema(
  {
    owner: {
      type: Types.ObjectId,
      required: true,
      ref: 'User',
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    alias: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    instructions: {
      type: [String],
      required: true,
    },
    ingredients: [
      {
        ingredient: {
          type: Ingredient.schema, // Assuming Ingredient is a Mongoose model
          required: true,
        },
        amount: {
          type: String,
          required: true,
          trim: true,
        },
        unit: {
          type: String,
          required: true,
          trim: true,
        },
      },
    ],
    isPublic: {
      type: Boolean,
      default: false,
    },
    dateCreated: {
      type: Date,
      default: Date.now,
    },
    dateUpdated: {
      type: Date,
      default: Date.now,
    },
    type: {
      type: String,
      trim: true,
    },
    mealTime: {
      type: String,
      trim: true,
    },
    cuisine: {
      type: String,
      trim: true,
    },
    servings: {
      type: Number,
      required: true,
    },
    prepTime: {
      type: Number, // in minutes
      required: true,
    },
    cookTime: {
      type: Number, // in minutes
      required: true,
    },
    totalTime: {
      type: Number, // in minutes
      required: true,
    },
    calories: {
      type: Number,
    },
    tags: {
      type: [String],
      trim: true,
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

// Create and export the model
const Recipe = model('Recipe', RecipeSchema);

module.exports = Recipe;
