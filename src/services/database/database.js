const mongoose = require('mongoose');

// Connection URI
const uri = `mongodb+srv://${encodeURIComponent(process.env.DATABASE_USERNAME)}:${encodeURIComponent(process.env.DATABASE_PASSWORD)}@${process.env.DATABASE_LOCATION}/?retryWrites=true&w=majority`;

async function connectDB() {
  console.log('Attempting to connect to MongoDB...');
  
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,     // Parses MongoDB connection strings properly.
      useUnifiedTopology: true,  // Uses the new Server Discover and Monitoring engine.
      useCreateIndex: true,      // Ensures indexes are created.
      useFindAndModify: false,   // Uses native findOneAndUpdate() instead of deprecated one.
    });

    console.log("Connected to MongoDB server via Mongoose");
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;  // Ensures caller is aware of the failure.
  }
}

module.exports = connectDB;
