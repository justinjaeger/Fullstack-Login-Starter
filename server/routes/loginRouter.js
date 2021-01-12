const express = require("express");
const router = express.Router();

const loginController = require('../controllers/loginController');
const tokenController = require('../controllers/tokenController');

// Log in user 
router.post('/',
  loginController.verifyUserAndStoreUserId,
  loginController.verifyPassword,
  tokenController.createJWT,
  loginController.returnUserData,
  (req, res) => {
    return res.status(200).send(res.locals.userData);
});

// Validate user 
router.get('/validate',
  tokenController.verifyJWT,
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

module.exports = router;