const express = require("express");
const router = express.Router();

const signupController = require('../controllers/signupController');
const loginController = require('../controllers/loginController');
const cookieController = require('../controllers/cookieController');
const userController = require('../controllers/userController');

// Sign up a user
router.post('/',
  signupController.validateUsername,
  signupController.validatePassword,
  loginController.hashPassword,
  signupController.createUser,
  signupController.getUserIdByUsername,
  cookieController.createCookie,
  // signupController.sendVerificationEmail, // does nothing right now
  cookieController.validateAndReturnUser,
  (req, res) => {
    console.log('final thing to send', res.locals.user)
    return res.status(200).send(res.locals.user);
});

// Authenticate a user (via email)
router.post('/auth',
  // loginController.checkPassword, // asks user to enter password again
  // loginController.authenticateUser, // changes status of authenticated from 0 to 1
  // loginController.login, // actually logs the user in and sends the cookie
  (req, res) => {
    return res.status(200).send();
});

module.exports = router;