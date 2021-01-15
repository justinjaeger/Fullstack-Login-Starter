const express = require("express");
const router = express.Router();

const loginController = require('../controllers/loginController');
const tokenController = require('../controllers/tokenController');

// Log in user 
router.post('/',
  loginController.verifyUserAndStoreUserId,
  loginController.verifyPassword,
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