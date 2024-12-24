// Import necessary functions from Mongoose
const { Schema, model } = require('mongoose');

// Define the schema for the Ingredient model
const IngredientSchema = new Schema(
  {
    // Name field is required, unique, lowercase, and trimmed
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
    },

    alias: {
      type: String,
      required: false,
      trim: true,
    },

    // Description is optional and trimmed
    description: {
      type: String,
      trim: true,
      required: false,
    },

    // Calories field is optional and a number
    calories: {
      type: Number,
      required: false,
    },

    image: {
      type: Buffer, // Use a URL (String) instead if scalability or external storage is needed
      required: false,
    },

    // Nutritional information is an embedded object with optional numeric fields
    nutritionalInfo: {
      fat: { type: Number }, // Fat content in grams
      protein: { type: Number }, // Protein content in grams
      carbohydrates: { type: Number }, // Carbohydrate content in grams
      fiber: { type: Number }, // Fiber content in grams
      sodium: { type: Number }, // Sodium content in mg
      salt: { type: Number }, // Salt content in mg
    },

    servingUnit: {
      type: String,
      trim: true,
      required: false,
    },

    barcodeNumber: {
      type: String,
      required: false,
    },

    // Field to track the user who created the ingredient
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User', // Reference to the User model
      required: true, // Mark as required if you want to enforce this relationship
    },
  },
  {
    // Add timestamps for createdAt and updatedAt fields
    timestamps: true,
  }
);

// Create the Ingredient model from the schema
const Ingredient = model('Ingredient', IngredientSchema);

// Export the Ingredient model for use in the application
module.exports = Ingredient;
