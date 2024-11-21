const express = require('express');
const createUser = require('../../services/users');
const validate = require('../../middleware/validate');
const { userValidationSchema } = require('./validator');

const userRouter = express.Router();

userRouter.post('/', validate(userValidationSchema), createUser);

userRouter.all('/', async (_, res) => {
  res.status(200).send('users!');
});

module.exports = userRouter;
