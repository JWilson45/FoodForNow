// src/services/database/models/pantry.js

const { Schema, model } = require('mongoose');

// Define the Mongoose schema for Pantry
const PantrySchema = new Schema(
  {
    // Reference to the Ingredient model
    ingredientId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Ingredient', // Assumes a separate Ingredient model
    },

    // User ID (reference to the User model)
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User', // References the User model
    },

    // Quantity of the ingredient in the pantry
    quantity: {
      type: Number,
      required: true,
      min: 1, // Must be at least 1
    },

    // Date added to pantry
    dateAdded: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
    toJSON: { virtuals: true }, // Include virtuals when converting to JSON
    toObject: { virtuals: true }, // Include virtuals when converting to objects
  }
);

// Virtual property to retrieve full ingredient details
PantrySchema.virtual('ingredientDetails', {
  ref: 'Ingredient',
  localField: 'ingredientId',
  foreignField: '_id',
  justOne: true, // Returns a single ingredient object
});

// Virtual property to calculate how long the ingredient has been in the pantry (in days)
PantrySchema.virtual('daysInPantry').get(function () {
  const now = new Date();
  const addedAt = this.dateAdded || this.createdAt || now;
  return Math.floor((now - addedAt) / (1000 * 60 * 60 * 24)); // Returns days
});

// Index to prevent duplicate entries for the same user and ingredient
PantrySchema.index(
  { ingredientId: 1, userId: 1 },
  { unique: true } // Ensures each user can only add an ingredient once
);

// Create and export the Pantry model
const Pantry = model('Pantry', PantrySchema);

module.exports = Pantry;