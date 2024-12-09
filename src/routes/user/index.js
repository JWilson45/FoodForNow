// Import the Express framework
const express = require('express');

// Import service functions for user operations
const { createUser, signInUser } = require('../../services/users');

// Import the validation middleware
const validate = require('../../middleware/validate');

// Import validation schemas for user creation and login
const {
  userValidationSchema,
  userLoginValidationSchema,
} = require('./validator');

// Create a new router instance for handling user-related routes
const userRouter = express.Router();

/**
 * Route to handle user creation (registration).
 * - Validates the request body using the userValidationSchema.
 * - Calls the createUser service function to process the request.
 */
userRouter.post('/', validate(userValidationSchema, 'body'), createUser);

/**
 * Route to handle user login.
 * - Validates the request body using the userLoginValidationSchema.
 * - Calls the signInUser service function to process the login.
 */
userRouter.post(
  '/login',
  validate(userLoginValidationSchema, 'body'),
  signInUser
);

/**
 * Catch-all route for the base `/` path of this router.
 * Responds with a 200 status and a message indicating the users endpoint.
 */
userRouter.all('/', async (_, res) => {
  res.status(200).send('users!');
});

// Export the router to be used in the main application
module.exports = userRouter;
