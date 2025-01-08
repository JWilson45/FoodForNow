const mongoose = require('mongoose');
const checkEnvVars = require('../../utilities/checkEnvVars');

// Check if the required environment variables are set
checkEnvVars(['DATABASE_USERNAME', 'DATABASE_PASSWORD', 'DATABASE_URI']);

// Create the connection URI using the environment variables
// The encodeURIComponent ensures special characters in the username or password are properly encoded
const uri = `mongodb+srv://${encodeURIComponent(
  process.env.DATABASE_USERNAME
)}:${encodeURIComponent(
  process.env.DATABASE_PASSWORD
)}@${process.env.DATABASE_URI}/FFN?authSource=admin&retryWrites=true&w=majority&appName=FoodForNowRecipes`;

// Function to establish a connection to the MongoDB database using Mongoose
const connectDB = async () => {
  console.log('Attempting to connect to MongoDB...');

  try {
    // Attempt to connect to the database with the URI
    await mongoose.connect(uri); // Simplified connection with default options
    console.log('Connected to MongoDB server via Mongoose'); // Success message if connected
  } catch (error) {
    // Log and throw error if connection fails
    console.error('Error connecting to MongoDB:', error);
    throw error; // Ensures caller is aware of the connection failure
  }
};

// Export the connection function for use in other parts of the application
module.exports = connectDB;
