// src/services/database/models/meal.js

const { Schema, model, Types } = require('mongoose');

const MealSchema = new Schema(
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
    description: {
      type: String,
      trim: true,
    },
    recipes: [
      {
        type: Types.ObjectId,
        ref: 'Recipe',
        required: true,
      },
    ],
    mealTime: {
      type: String,
      trim: true,
    },
    servings: {
      type: Number,
      required: true,
    },
    calories: {
      type: Number,
    },
    tags: {
      type: [String],
      trim: true,
    },
    isVegetarian: {
      type: Boolean,
      default: false,
    },
    isVegan: {
      type: Boolean,
      default: false,
    },
    cuisine: {
      type: String,
      trim: true,
    },
    // We won't store prepTime, cookTime, totalTime directly.
    // They will be computed from recipes.
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual fields for times based on recipes
MealSchema.virtual('prepTime').get(function () {
  if (!this.recipes || !Array.isArray(this.recipes)) return 0;
  // If recipes are populated, each recipe has prepTime
  // If not populated, this may return 0.
  return this.recipes.reduce((sum, recipe) => sum + (recipe.prepTime || 0), 0);
});

MealSchema.virtual('cookTime').get(function () {
  if (!this.recipes || !Array.isArray(this.recipes)) return 0;
  return this.recipes.reduce((sum, recipe) => sum + (recipe.cookTime || 0), 0);
});

MealSchema.virtual('totalTime').get(function () {
  return this.prepTime + this.cookTime;
});

const Meal = model('Meal', MealSchema);

module.exports = Meal;
