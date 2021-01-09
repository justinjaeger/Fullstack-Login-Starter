const express = require("express");
const router = express.Router();

const signupController = require('../controllers/signupController');
const loginController = require('../controllers/loginController');

// Sign up a user
router.post('/',
  signupController.validateUsername,
  signupController.validatePassword,
  signupController.hashPassword,
  signupController.createUser,
  signupController.sendVerificationEmail,
  (req, res) => {
    return res.status(200).send();
});

// Authenticate a user (via email)
router.post('/',
  loginController.checkPassword, // asks user to enter password again
  loginController.authenticateUser, // changes status of authenticated from 0 to 1
  loginController.login, // actually logs the user in and sends the cookie
  (req, res) => {
    return res.status(200).send();
});

module.exports = router;