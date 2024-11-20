const { Schema, model, Types } = require('mongoose');

// Sub-schema for recipe-specific ingredient details
const RecipeIngredientSchema = new Schema({
  ingredientId: {
    type: Types.ObjectId,
    ref: 'Ingredient',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    min: [0, 'Amount must be a positive number'],
  },
  unit: {
    type: String,
    required: true,
    trim: true,
    // enum: ['grams', 'cups', 'tablespoons', 'teaspoons', 'pieces', 'other'],
  },
  notes: {
    type: String,
    trim: true,
  },
});

// Main recipe schema
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
      maxLength: 1000,
    },
    instructions: {
      type: [String],
      required: true,
    },
    ingredients: {
      type: [RecipeIngredientSchema], // Embedded sub-schema
      validate: {
        validator: (v) => Array.isArray(v) && v.length > 0,
        message: 'A recipe must have at least one ingredient.',
      },
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      trim: true,
    },
    mealTime: {
      type: String,
      trim: true,
      enum: ['breakfast', 'lunch', 'dinner', 'snack', 'dessert'],
    },
    cuisine: {
      type: String,
      trim: true,
      enum: ['italian', 'chinese', 'mexican', 'indian', 'american', 'other'],
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
    calories: {
      type: Number,
    },
    tags: {
      type: [String],
      set: (tags) => tags.map((tag) => tag.trim().toLowerCase()),
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

// Virtual to compute total time
RecipeSchema.virtual('totalTime').get(function () {
  return this.prepTime + this.cookTime;
});

// Index for querying performance
RecipeSchema.index({ owner: 1 });
RecipeSchema.index({ isPublic: 1 });
RecipeSchema.index({ tags: 1 });
RecipeSchema.index({ 'ingredients.ingredientId': 1 });
RecipeSchema.index({ isPublic: 1, tags: 1 });

const Recipe = model('Recipe', RecipeSchema);

module.exports = Recipe;
