// src/server.js

const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const cors = require('cors');

const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');
const connectDB = require('./services/database');

const app = express();

// CORS Configuration
const corsOptions = {
  origin: 'http://localhost:3000', // Allow requests from Next.js frontend
  credentials: true, // Allow credentials (cookies, etc.)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
};
app.use(cors(corsOptions)); // Enable CORS with the specified options

// Logging Middleware
app.use(
  morgan('dev', {
    skip: (req) => {
      return !req.originalUrl.startsWith('/api');
    },
  })
);

// Parsing Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use('/api', routes);

// 404 Handler for Undefined Routes
app.use((_, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Centralized Error Handling Middleware
app.use(errorHandler);

// Get the port from command-line arguments or environment variable
const args = process.argv.slice(2);
let port = 9696; // default port
const portFlagIndex = args.indexOf('--port');
if (portFlagIndex !== -1 && args[portFlagIndex + 1]) {
  const parsedPort = parseInt(args[portFlagIndex + 1], 10);
  if (!isNaN(parsedPort)) {
    port = parsedPort;
  }
}

app.listen(port, async () => {
  await connectDB(); // Ensure database is connected before starting the server
  console.log(`Pantry Server is running on port ${port}`);
});
