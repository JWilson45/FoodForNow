const express = require('express');
const createUser = require('../services/users');

const userRouter = express.Router();

userRouter.post('/', createUser);

userRouter.all('/', async (_, res) => {
  res.status(200).send('users!');
});

module.exports = userRouter;
