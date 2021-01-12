const express = require("express");
const router = express.Router();

const signupController = require('../controllers/signupController');
const loginController = require('../controllers/loginController');
const tokenController = require('../controllers/tokenController');
const userController = require('../controllers/userController');

// Sign up a user
router.post('/',
  signupController.validateUsername,
  signupController.validatePassword,
  signupController.hashPassword,
  signupController.createUser,
  signupController.getUserIdByUsername,
  tokenController.createJWT,
  loginController.returnUserData,
  (req, res) => {
    return res.status(200).send(res.locals.userData);
});

module.exports = router;