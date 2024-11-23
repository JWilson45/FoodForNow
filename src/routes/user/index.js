const express = require('express');
const { createUser, signInUser } = require('../../services/users');
const validate = require('../../middleware/validate');
const {
  userValidationSchema,
  userLoginValidationSchema,
} = require('./validator');

const userRouter = express.Router();

userRouter.post('/', validate(userValidationSchema), createUser);

userRouter.post('/login', validate(userLoginValidationSchema), signInUser);

userRouter.all('/', async (_, res) => {
  res.status(200).send('users!');
});

module.exports = userRouter;
