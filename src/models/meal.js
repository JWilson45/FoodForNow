const { Schema, model, Types } = require("mongoose");

// Create the Mongoose schema for Meal
const MealSchema = new Schema({
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
    }
  ],
  dateCreated: {
    type: Date,
    default: Date.now,
  },
  dateUpdated: {
    type: Date,
    default: Date.now,
  },
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
  prepTime: {
    type: Number, // in minutes
  },
  cookTime: {
    type: Number, // in minutes
  },
  totalTime: {
    type: Number, // in minutes
  },
}, {
  timestamps: true, // Automatically add createdAt and updatedAt fields
});

// Create and export the model
const Meal = model("Meal", MealSchema);

module.exports = Meal;
