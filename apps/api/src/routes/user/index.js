const express = require('express');
const {
  createUser,
  signInUser,
  checkIfLoggedIn,
} = require('../../services/users');
const validate = require('../../middleware/validate');
const {
  userValidationSchema,
  userLoginValidationSchema,
} = require('./validator');

const userRouter = express.Router();

/**
 * Route to handle user creation (registration).
 * - Validates the request body using the userValidationSchema.
 * - Calls the createUser service function to process the request.
 */
userRouter.post('/signup', (req, res, next) => {
  console.log('Incoming request to /signup:', req.body);
  next();
}, validate(userValidationSchema, 'body'), createUser);

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
 * Route to check if a user is logged in.
 * - Calls the checkIfLoggedIn service function to check and decode the token.
 */
userRouter.get('/check', (req, res) => {
  checkIfLoggedIn(req, res);
});

/**
 * Route to handle user logout.
 * - Clears the authToken cookie.
 */
userRouter.post('/logout', (_, res) => {
  res.clearCookie('authToken', {
    httpOnly: true, // Ensures the cookie is not accessible via JavaScript
    secure: process.env.NODE_ENV === 'production', // Ensures the cookie is sent over HTTPS in production
    sameSite: 'strict', // Restricts the cookie to same-site requests
  });
  return res.status(200).json({ message: 'Logged out successfully' });
});

/**
 * Catch-all route for the base `/` path of this router.
 * Responds with a 200 status and a message indicating the users endpoint.
 */
userRouter.all('/', async (_, res) => {
  res.status(200).send('users!');
});

// Export the router to be used in the main application
module.exports = userRouter;