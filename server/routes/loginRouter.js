const express = require("express");
const router = express.Router();

const loginController = require('../controllers/loginController');
const cookieController = require('../controllers/cookieController');

// Log in user 
router.post('/',
  loginController.verifyUserExists,
  loginController.verifyPassword,
  cookieController.createCookie,
  cookieController.validateAndReturnUser,
  (req, res) => {
    return res.status(200).send(res.locals.user);
});

// Validate user 
router.get('/validate',
  cookieController.validateAndReturnUser,
  (req, res) => {
    return res.status(200).send(res.locals.user);
});

// Log out user 
router.get('/logout',
  cookieController.removeCookie,
  (req, res) => {
    return res.status(200).send();
});

module.exports = router;