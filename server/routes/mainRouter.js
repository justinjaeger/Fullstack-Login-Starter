const express = require("express");
const router = express.Router();

const loginRouter = require('./loginRouter');
const signupRouter = require('./signupRouter');
const userRouter = require('./userRouter');

router.use('/login', loginRouter);
router.use('/signup', signupRouter);
router.use('/users', userRouter);

module.exports = router;