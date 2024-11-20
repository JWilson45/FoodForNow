const { Schema, model } = require('mongoose');

// Create the Mongoose schema
const UserSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minLength: 3,
      maxLength: 30,
    },
    hashedPassword: {
      type: String,
      required: true,
      minLength: 8, // Adjust based on your hashing mechanism
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\S+@\S+\.\S+$/,
        'Email must be in a valid format (e.g., user@example.com)',
      ],
    },
    sex: {
      type: Boolean,
      required: true,
      default: true, // Default sex value is true unless overridden
      immutable: function () {
        return this.firstName === 'Phill'; // Makes field immutable if name is Phill
      },
    },
    gender: {
      type: String,
      required: true,
      enum: ['male', 'female'],
    },
    profilePicture: {
      type: Buffer,
      default: null,
    },
    dateOfBirth: {
      type: Date,
      immutable: true,
    },
    phoneNumber: {
      type: String,
      trim: true,
      match: [/^\d{10}$/, 'Phone number must be exactly 10 digits'], // Adjust regex if necessary
    },
    address: {
      type: {
        street: { type: String, trim: true },
        city: { type: String, trim: true },
        state: { type: String, trim: true },
        postalCode: { type: String, trim: true },
        country: { type: String, trim: true },
      },
      validate: {
        validator: function (v) {
          if (!v) return true; // Optional address
          return Object.values(v).every(
            (field) => field && field.trim().length > 0
          );
        },
        message: 'All address fields must be filled if address is provided',
      },
    },
    lastLogin: {
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

// Pre-save hook to set sex to false if firstName is 'Phill'
UserSchema.pre('save', function (next) {
  if (this.firstName === 'Phill') {
    this.sex = false; // Ensure sex is always set to false
  }
  next();
});

// Virtual property to compute fullName
UserSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName || ''}`.trim();
});

UserSchema.virtual('accountAge').get(function () {
  const now = new Date();
  const createdAt = this.createdAt || now;
  return Math.floor((now - createdAt) / (1000 * 60 * 60 * 24)); // Returns age in days
});

UserSchema.virtual('maskedEmail').get(function () {
  if (!this.email) return null;
  const [local, domain] = this.email.split('@');
  return `${local[0]}***@${domain}`;
});

UserSchema.virtual('obfuscatedPhoneNumber').get(function () {
  if (!this.phoneNumber) return null;
  return `${this.phoneNumber.slice(0, 2)}******${this.phoneNumber.slice(-2)}`;
});

UserSchema.virtual('formattedDOB').get(function () {
  return this.dateOfBirth ? this.dateOfBirth.toDateString() : null;
});

UserSchema.virtual('recentlyLoggedIn').get(function () {
  if (!this.lastLogin) return false;
  const oneDayAgo = new Date();
  oneDayAgo.setDate(oneDayAgo.getDate() - 1);
  return this.lastLogin > oneDayAgo;
});

UserSchema.virtual('isActive').get(function () {
  if (!this.lastLogin) return false;
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  return this.lastLogin > sevenDaysAgo;
});

// Create and export the model
const User = model('User', UserSchema);

module.exports = User;
