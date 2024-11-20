const express = require('express');
const { getUser, createNewUser } = require('../controllers/user');

const userRouter = express.Router();

// Define your routes
userRouter.get('/', getUser);

userRouter.post('/', createNewUser);

// Export the router
module.exports = userRouter;
