const express = require('express'); // Import the Express framework
const routes = require('./routes'); // Import application routes
const morgan = require('morgan'); // Import Morgan for HTTP request logging
const connectDB = require('./services/database/database'); // Import the database connection function
const cookieParser = require('cookie-parser');

const app = express(); // Create an Express application instance

// Middleware configuration
app.use(cookieParser());
app.use(express.json()); // Parse incoming JSON requests
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined')); // Log HTTP requests in the 'combined' format
app.use(express.static('public')); // Serve static files from the 'public' directory

// Register API routes under the '/api' path
app.use('/api', routes);

const PORT = process.env.PORT || 9696;

// Start the HTTP server
app.listen(PORT, async () => {
  await connectDB(); // Establish a connection to the database
  console.log(`Server listening on port ${PORT}`); // Log that the server is running
});
