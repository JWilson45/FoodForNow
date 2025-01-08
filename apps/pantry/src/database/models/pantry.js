const { Schema, model } = require('mongoose');

const PantrySchema = new Schema(
  {
    pantryName: {
      type: String,
      required: true,
      default: 'Home',
    },
    ingredients: [
      {
        ingredientId: {
          type: Schema.Types.ObjectId,
          required: true,
          ref: 'Ingredient',
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        unit: {
          type: String,
          required: true,
          enum: ['unit', 'g', 'kg', 'oz', 'lbs', 'ml', 'L'],
          default: 'unit',
        },
        dateAdded: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Index to ensure pantry names are unique per user
PantrySchema.index({ userId: 1, pantryName: 1 }, { unique: true });

module.exports = model('Pantry', PantrySchema);