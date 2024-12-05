const express = require('express'); // Import the Express framework
const routes = require('./routes'); // Import application routes
const morgan = require('morgan'); // Import Morgan for HTTP request logging
const connectDB = require('./services/database/database'); // Import the database connection function
const cookieParser = require('cookie-parser'); // Import cookie-parser to parse cookies in requests

const app = express(); // Create an Express application instance

// Middleware configuration
app.use(cookieParser()); // Enable cookie parsing middleware
app.use(express.json()); // Parse incoming JSON requests and populate req.body
app.use(express.urlencoded({ extended: true })); // Parse incoming URL-encoded data (e.g., form submissions)
app.use(morgan('combined')); // Log HTTP requests using the 'combined' log format (standard log format)
app.use(express.static('public')); // Serve static files (like images, CSS, JS) from the 'public' directory

// Register API routes under the '/api' path
app.use('/api', routes); // All routes prefixed with '/api' will be handled by the imported routes

const PORT = process.env.PORT || 9696; // Set the port to the environment variable PORT or default to 9696

// Start the HTTP server
app.listen(PORT, async () => {
  await connectDB(); // Establish a connection to the database before starting the server
  console.log(`Server listening on port ${PORT}`); // Log that the server is running
});
