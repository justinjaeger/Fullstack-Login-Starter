const express = require("express");
const router = express.Router();

const signupController = require('../controllers/signupController');
const loginController = require('../controllers/loginController');
const tokenController = require('../controllers/tokenController');

// Sign up a user
router.post('/',
  signupController.validateEmailAndUsername,
  signupController.validatePassword,
  signupController.hashPassword,
  signupController.createUser,
  signupController.getUserIdByUsername,
  tokenController.createAccessToken,
  loginController.returnUserData,
  (req, res) => {
    return res.status(200).send(res.locals.userData);
});

module.exports = router;