// Import necessary functions from Mongoose
const { Schema, model } = require('mongoose');

// Define the Mongoose schema for User
const UserSchema = new Schema(
  {
    // First name of the user
    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    // Last name of the user (optional)
    lastName: {
      type: String,
      trim: true,
    },

    // Username (unique, between 3 and 30 characters)
    username: {
      type: String,
      required: true,
      trim: true,
      minLength: 3,
      maxLength: 30,
    },

    // Hashed password (required, at least 8 characters)
    hashedPassword: {
      type: String,
      required: true,
      minLength: 8, // Adjust based on your hashing mechanism
    },

    // Gender (optional, immutable, and limited to male/female)
    gender: {
      type: String,
      required: false,
      immutable: true,
      enum: ['male', 'female'],
    },

    // Email (unique, required, and validated with a regex)
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

    // Sex (Boolean, immutable if the user's name is 'Phill')
    sex: {
      type: Boolean,
      required: true,
      default: true, // Default sex value is true unless overridden
      immutable: function () {
        return this.firstName === 'Phill'; // Makes field immutable if name is Phill
      },
    },

    // Profile picture (optional, stored as a Buffer)
    profilePicture: {
      type: Buffer,
      default: null,
    },

    // Date of birth (immutable)
    dateOfBirth: {
      type: Date,
      immutable: true,
    },

    // Phone number (optional, validated to be exactly 10 digits)
    phoneNumber: {
      type: String,
      trim: true,
      match: [/^\d{10}$/, 'Phone number must be exactly 10 digits'], // Adjust regex if necessary
    },

    // Last login timestamp (default to current time)
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

// Pre-save hook to modify the 'sex' field if firstName is 'Phill'
UserSchema.pre('save', function (next) {
  if (this.firstName === 'Phill') {
    this.sex = false; // Ensure sex is always set to false
  }
  next();
});

// Virtual property to compute the full name of the user
UserSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName || ''}`.trim();
});

// Virtual property to compute the account age in days
UserSchema.virtual('accountAge').get(function () {
  const now = new Date();
  const createdAt = this.createdAt || now;
  return Math.floor((now - createdAt) / (1000 * 60 * 60 * 24)); // Returns age in days
});

// Virtual property to mask the email address (e.g., user@example.com -> u***@example.com)
UserSchema.virtual('maskedEmail').get(function () {
  if (!this.email) return null;
  const [local, domain] = this.email.split('@');
  return `${local[0]}***@${domain}`;
});

// Virtual property to obfuscate the phone number (e.g., 1234567890 -> 12******90)
UserSchema.virtual('obfuscatedPhoneNumber').get(function () {
  if (!this.phoneNumber) return null;
  return `${this.phoneNumber.slice(0, 2)}******${this.phoneNumber.slice(-2)}`;
});

// Virtual property to format the date of birth into a readable string
UserSchema.virtual('formattedDOB').get(function () {
  return this.dateOfBirth ? this.dateOfBirth.toDateString() : null;
});

// Virtual property to check if the user recently logged in within the last day
UserSchema.virtual('recentlyLoggedIn').get(function () {
  if (!this.lastLogin) return false;
  const oneDayAgo = new Date();
  oneDayAgo.setDate(oneDayAgo.getDate() - 1);
  return this.lastLogin > oneDayAgo;
});

// Virtual property to check if the user is active (logged in within the last 7 days)
UserSchema.virtual('isActive').get(function () {
  if (!this.lastLogin) return false;
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  return this.lastLogin > sevenDaysAgo;
});

// Indexing for performance optimization
UserSchema.index(
  { username: 1 },
  { unique: true, collation: { locale: 'en', strength: 2 } } // Case-insensitive username search
);

// Create and export the User model
const User = model('User', UserSchema);

module.exports = User;
