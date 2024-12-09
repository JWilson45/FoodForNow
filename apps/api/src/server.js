// src/server.js

const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
// const helmet = require('helmet');

const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');
const connectDB = require('./services/database');

const app = express();

// Security Middlewares
// app.use(helmet());

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

// Serve Static Files (if any)
app.use(express.static('public'));

// 404 Handler for Undefined Routes
app.use((_, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Centralized Error Handling Middleware
app.use(errorHandler);

// Start Server after Database Connection
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  await connectDB(); // Ensure database is connected before starting the server
  console.log(`Server is running on port ${PORT}`);
});
