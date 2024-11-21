const express = require('express');
const routes = require('./routes');
const morgan = require('morgan');
const connectDB = require('./services/database/database');

const app = express();

// Middleware configuration
app.use(morgan('combined'));
app.use(express.static('public'));
app.use(express.json());

app.use('/api', routes);

const PORT = process.env.PORT || 9696;

// Start the HTTP server
app.listen(PORT, async () => {
  await connectDB();
  console.log(`Server listening on port ${PORT}`);
});
