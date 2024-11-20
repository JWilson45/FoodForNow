const express = require('express');

const userRouter = express.Router();

userRouter.all('/', async (_, res) => {
  res.status(200).send('users!');
});

module.exports = userRouter;
