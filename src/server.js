const express = require('express');
const routes = require('./routes');

// Load environment variables
require('dotenv').config();

const connectDB = require('./services/database/database');

const PORT = process.env.PORT || 8080;

const app = express();

// Middleware configuration
app.use(express.static('public'));
app.use(express.json());

app.use(routes);

// Start the HTTP server
app.listen(PORT, async () => {
  await connectDB();
  console.log(`Server listening on port ${PORT}`);
});
