// Import necessary functions from Mongoose
const { Schema, model, Types } = require('mongoose');

// Define the schema for the Meal model
const MealSchema = new Schema(
  {
    // Reference to the user who owns the meal
    owner: {
      type: Types.ObjectId,
      required: true,
      ref: 'User', // Links to the User model
    },

    // Name of the meal, required and trimmed
    name: {
      type: String,
      required: true,
      trim: true,
    },

    // Optional description of the meal, trimmed
    description: {
      type: String,
      trim: true,
    },

    // Array of references to Recipe documents
    recipes: [
      {
        type: Types.ObjectId,
        ref: 'Recipe', // Links to the Recipe model
        required: true,
      },
    ],

    // Timestamps for meal creation and updates
    dateCreated: {
      type: Date,
      default: Date.now, // Defaults to the current date
    },
    dateUpdated: {
      type: Date,
      default: Date.now, // Defaults to the current date
    },

    // Time of the meal (e.g., breakfast, lunch, dinner)
    mealTime: {
      type: String,
      trim: true,
    },

    // Number of servings for the meal
    servings: {
      type: Number,
      required: true,
    },

    // Total calories for the meal
    calories: {
      type: Number,
    },

    // Tags for categorizing the meal (e.g., quick, gluten-free)
    tags: {
      type: [String],
      trim: true,
    },

    // Flags indicating if the meal is vegetarian or vegan
    isVegetarian: {
      type: Boolean,
      default: false,
    },
    isVegan: {
      type: Boolean,
      default: false,
    },

    // Cuisine type (e.g., Italian, Indian)
    cuisine: {
      type: String,
      trim: true,
    },

    // Preparation time in minutes
    prepTime: {
      type: Number, // Time in minutes
    },

    // Cooking time in minutes
    cookTime: {
      type: Number, // Time in minutes
    },

    // Total time (prep + cook) in minutes
    totalTime: {
      type: Number, // Time in minutes
    },
  },
  {
    // Automatically add createdAt and updatedAt fields
    timestamps: true,
  }
);

// Create and export the Meal model
const Meal = model('Meal', MealSchema);

module.exports = Meal;
