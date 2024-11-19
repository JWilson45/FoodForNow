const mongoose = require('mongoose');

// Connection URI
const uri = `mongodb+srv://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_LOCATION}`;

// Connect to the MongoDB server using Mongoose
async function connect() {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB server via Mongoose");
  } catch (error) {
    console.error('Error connecting to MongoDB with Mongoose:', error);
    throw error;
  }
}

// Export the connect function
module.exports = connect;
