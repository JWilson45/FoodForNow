// Import necessary functions from Mongoose
const { Schema, model, Types } = require('mongoose');

// Define a sub-schema for recipe-specific ingredient details
const RecipeIngredientSchema = new Schema({
  // Reference to an ingredient
  ingredientId: {
    type: Types.ObjectId,
    ref: 'Ingredient', // Links to the Ingredient model
    required: true,
  },

  // Amount of the ingredient required
  amount: {
    type: Number,
    required: true,
    min: [0, 'Amount must be a positive number'],
  },

  // Unit of measurement for the ingredient
  unit: {
    type: String,
    required: true,
    trim: true,
    // Optionally, restrict to predefined units for consistency
    // enum: ['grams', 'cups', 'tablespoons', 'teaspoons', 'pieces', 'other'],
  },

  // Optional notes for the ingredient (e.g., "chopped", "boiled")
  notes: {
    type: String,
    trim: true,
  },
});

// Define the main schema for the Recipe model
const RecipeSchema = new Schema(
  {
    // Reference to the user who owns the recipe
    owner: {
      type: Types.ObjectId,
      required: true,
      ref: 'User', // Links to the User model
    },

    // Name of the recipe
    name: {
      type: String,
      required: true,
      trim: true,
    },

    // Optional alias for the recipe
    alias: {
      type: String,
      trim: true,
    },

    // Description of the recipe (limited to 1000 characters)
    description: {
      type: String,
      trim: true,
      maxLength: 1000,
    },

    // Array of step-by-step instructions for the recipe
    instructions: {
      type: [String],
      required: true,
    },

    // List of ingredients with detailed information
    ingredients: {
      type: [RecipeIngredientSchema],
      validate: {
        validator: (v) => Array.isArray(v) && v.length > 0,
        message: 'A recipe must have at least one ingredient.',
      },
    },

    // Visibility flag indicating if the recipe is public
    isPublic: {
      type: Boolean,
      default: false,
    },

    // Recipe type (optional, e.g., "main course", "side dish")
    type: {
      type: String,
      trim: true,
    },

    // Suggested meal time for the recipe
    mealTime: {
      type: String,
      trim: true,
      enum: ['breakfast', 'lunch', 'dinner', 'snack', 'dessert'], // Restricted to specific meal times
    },

    // Cuisine type
    cuisine: {
      type: String,
      trim: true,
      enum: ['italian', 'chinese', 'mexican', 'indian', 'american', 'other'], // Restricted to common cuisine types
    },

    // Number of servings the recipe makes
    servings: {
      type: Number,
      required: true,
    },

    // Preparation time in minutes
    prepTime: {
      type: Number,
      required: true,
    },

    // Cooking time in minutes
    cookTime: {
      type: Number,
      required: true,
    },

    // Total calories for the recipe (optional)
    calories: {
      type: Number,
    },

    // Tags for categorizing the recipe
    tags: {
      type: [String],
      set: (tags) => tags.map((tag) => tag.trim().toLowerCase()), // Normalize tags to lowercase and trimmed
    },
  },
  {
    // Automatically manage createdAt and updatedAt fields
    timestamps: true,
  }
);

// Virtual field to calculate the total time (prep + cook)
RecipeSchema.virtual('totalTime').get(function () {
  return this.prepTime + this.cookTime;
});

// Indexing for optimized queries
RecipeSchema.index({ owner: 1 }); // Optimize queries by owner
RecipeSchema.index({ isPublic: 1 }); // Optimize public recipe queries
RecipeSchema.index({ tags: 1 }); // Optimize queries by tags
RecipeSchema.index({ 'ingredients.ingredientId': 1 }); // Optimize ingredient lookups
RecipeSchema.index({ isPublic: 1, tags: 1 }); // Optimize combined public and tag queries

// Create the Recipe model from the schema
const Recipe = model('Recipe', RecipeSchema);

// Export the Recipe model for use in the application
module.exports = Recipe;
