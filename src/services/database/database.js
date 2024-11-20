const mongoose = require('mongoose');

// Connection URI
const uri = `mongodb+srv://${encodeURIComponent(process.env.DATABASE_USERNAME)}:${encodeURIComponent(process.env.DATABASE_PASSWORD)}@${process.env.DATABASE_URI}/FFN?authSource=admin&retryWrites=true&w=majority&appName=FoodForNowRecipes`;

const connectDB = async () => {
  console.log('Attempting to connect to MongoDB...');

  try {
    await mongoose.connect(uri); // Simplified connection with defaults.
    console.log('Connected to MongoDB server via Mongoose');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error; // Ensures caller is aware of the failure.
  }
};

module.exports = connectDB;
