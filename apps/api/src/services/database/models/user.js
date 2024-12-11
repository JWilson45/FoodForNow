const { Schema, model } = require('mongoose');

// Define the Mongoose schema for User
const UserSchema = new Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, trim: true },
    username: {
      type: String,
      required: true,
      trim: true,
      minLength: 3,
      maxLength: 30,
    },
    hashedPassword: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: ['male', 'female'],
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
    phoneNumber: {
      type: String,
      trim: true,
      match: [/^\d{10}$/, 'Phone number must be exactly 10 digits'],
    },
    profilePicture: { type: Buffer, default: null },
    dateOfBirth: { type: Date, immutable: true },
    lastLogin: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Pre-save hook to modify `sex` field for specific conditions
UserSchema.pre('save', function (next) {
  if (this.firstName === 'Phill') {
    this.sex = false;
  }
  next();
});

// Virtual properties
UserSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName || ''}`.trim();
});

UserSchema.virtual('accountAge').get(function () {
  const now = new Date();
  const createdAt = this.createdAt || now;
  return Math.floor((now - createdAt) / (1000 * 60 * 60 * 24));
});

UserSchema.virtual('maskedEmail').get(function () {
  if (!this.email) return null;
  const [local, domain] = this.email.split('@');
  return `${local[0]}***@${domain}`;
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

// Handle duplicate key errors gracefully
UserSchema.post('save', function (error, doc, next) {
  if (error.name === 'MongoServerError' && error.code === 11000) {
    next(new Error('Duplicate field value: Username or email already exists.'));
  } else {
    next(error);
  }
});

// Add unique indexes
UserSchema.index(
  { username: 1 },
  { unique: true, collation: { locale: 'en', strength: 2 } }
);
UserSchema.index({ email: 1 }, { unique: true });

// Create and export the User model
const User = model('User', UserSchema);

module.exports = User;