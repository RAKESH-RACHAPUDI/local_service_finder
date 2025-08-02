const express = require('express');
const { register } = require('../controller/userControllers');

const userRouter = express.Router();
userRouter.post("/register", register);

module.exports = userRouter;
