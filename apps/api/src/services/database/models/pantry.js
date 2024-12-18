const { Schema, model, Types } = require('mongoose');

// Define the Mongoose schema for Pantry
const PantrySchema = new Schema(
  {
    pantryName: {
      type: String,
      required: true,
      default: 'Home', 
      // The default pantry name is 'Home'.
      // Not setting `unique: true` here, as multiple users can have a 'Home' pantry,
      // but a single user cannot have two 'Home' pantries.
    },

    // Array of ingredients (references to the Ingredient model)
    ingredients: [
      {
        ingredientId: {
          type: Schema.Types.ObjectId,
          required: true,
          ref: 'Ingredient', // Assumes a separate Ingredient model
        },
        quantity: {
          type: Number,
          required: true,
          min: 1, // Must be at least 1
        },
        unit: {
          type: String,
          required: true,
          default: 'unit', // A default unit; customize as needed
          // Optionally use enum: ['unit', 'g', 'kg', 'oz', 'lbs', 'ml', 'L']
        },
        dateAdded: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // User ID (reference to the User model)
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User', // References the User model
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
    toJSON: { virtuals: true }, // Include virtuals when converting to JSON
    toObject: { virtuals: true }, // Include virtuals when converting to objects
  }
);

// Virtual property to calculate how long each ingredient has been in the pantry (in days)
PantrySchema.virtual('ingredients.daysInPantry').get(function () {
  return this.ingredients.map((ingredient) => {
    const now = new Date();
    const addedAt = ingredient.dateAdded || now;
    return {
      ingredientId: ingredient.ingredientId,
      daysInPantry: Math.floor((now - addedAt) / (1000 * 60 * 60 * 24)), // Returns days
    };
  });
});

// Create a composite unique index so that a user cannot have multiple pantries with the same name.
// This still allows different users to have a pantry with the same name.
PantrySchema.index({ userId: 1, pantryName: 1 }, { unique: true });

// Create and export the Pantry model
const Pantry = model('Pantry', PantrySchema);

module.exports = Pantry;