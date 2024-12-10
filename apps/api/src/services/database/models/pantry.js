// src/services/database/models/pantry.js

const { Schema, model } = require('mongoose');

// Define the Mongoose schema for Pantry
const PantrySchema = new Schema(
  {
    // Name of the ingredient
    name: {
      type: String,
      required: true,
      trim: true,
    },

    // Quantity of the ingredient
    quantity: {
      type: Number,
      required: true,
      min: 1, // Must be at least 1
    },

    // Unit of measurement (optional)
    unit: {
      type: String,
      trim: true,
    },

    // User ID (reference to the User model)
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User', // References the User model
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

// Virtual property to format the ingredient's full description
PantrySchema.virtual('fullDescription').get(function () {
  const quantityString = this.quantity ? `${this.quantity} ${this.unit || ''}`.trim() : '';
  return `${quantityString} ${this.name}`.trim();
});

// Virtual property to calculate how long the ingredient has been in the pantry (in days)
PantrySchema.virtual('daysInPantry').get(function () {
  const now = new Date();
  const addedAt = this.dateAdded || this.createdAt || now;
  return Math.floor((now - addedAt) / (1000 * 60 * 60 * 24)); // Returns days
});

// Indexing for optimized queries
PantrySchema.index(
  { name: 1, userId: 1 },
  { unique: true, collation: { locale: 'en', strength: 2 } } // Case-insensitive name per user
);

// Create and export the Pantry model
const Pantry = model('Pantry', PantrySchema);

module.exports = Pantry;