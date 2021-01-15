const express = require("express");
const router = express.Router();

const loginRouter = require('./loginRouter');
const signupRouter = require('./signupRouter');
const userRouter = require('./userRouter');

router.use('/login', loginRouter);
router.use('/signup', signupRouter);
router.use('/users', userRouter);
router.get('/fuck', (req, res) => {
  console.log('hitting it')
  return res.status(500).redirect('/');
});

module.exports = router;