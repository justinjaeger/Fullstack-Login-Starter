const express = require("express");
const router = express.Router();

const loginController = require('../controllers/loginController');
const tokenController = require('../controllers/tokenController');
const emailController = require('../controllers/emailController');
const signupController = require('../controllers/signupController');

// Log in user 
router.post('/',
  loginController.verifyUserAndStoreUserId,
  loginController.verifyPassword,
  loginController.verifyEmailAuthenticated,
  tokenController.createAccessToken,
  loginController.returnUserData,
  (req, res) => {
    return res.status(200).send(res.locals.userData);
});

// Validate user 
router.get('/verifyUserAndReturnUserId',
  tokenController.verifyToken,
  loginController.returnUserData,
  (req, res) => {
    return res.status(200).send(res.locals.userData);
});

// Log out user 
router.get('/logout',
  tokenController.removeCookie,
  (req, res) => {
    return res.status(200).send();
});

// Send "reset password" email
router.post('/forgotPassword',
  loginController.ifEmailNoExistDontSend,
  emailController.sendResetPasswordEmail,
  (req, res) => {
    return res.status(200).send({ 
      message: `An email was sent to ${req.body.email}. Didn't receive email? Make sure address is correct.`,
      route: '/blank',
    });
});

// The reset password email link takes you here
router.get('/resetPassword', // /?email
  emailController.decryptEmail,
  (req, res) => {
    res.clearCookie('authenticated');
    res.cookie('reset_password', `XXX${res.locals.email}XXX`);
    return res.redirect('/');
});

// Reset password from email link
router.post('/changePasswordAndLogin',
  loginController.verifyUserAndStoreUserId,
  signupController.validatePassword,
  signupController.hashPassword,
  loginController.updatePassword,
  tokenController.createAccessToken,
  loginController.returnUserData,
  (req, res) => {
    res.clearCookie('reset_password');
    return res.status(200).send(res.locals.userData);
});

// If we refresh on /login it just goes back to homepage
router.get('/', (req, res) => {
  return res.redirect('/');
});

/*
// TEST to create token
router.post('/createToken',
  (req, res, next) => {
    res.locals.user_id = 33;
    return next();
  },
  tokenController.createAccessToken,
  (req, res) => {
    return res.sendStatus(200);
});

// TEST to verify token
router.post('/verifyToken', 
  tokenController.verifyToken,
  (req, res) => {
    return res.sendStatus(200);
});
*/

module.exports = router;