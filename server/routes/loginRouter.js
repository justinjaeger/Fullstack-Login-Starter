const express = require("express");
const router = express.Router();

/**
 * Require controllers below
 */
const userController = require('../controllers/userController');

/**
 * All /user routes
 */

// See all users
router.get('/',
  userController.getUsers,
  (req, res) => {
    console.log('inside userRouter');
    return res.send(res.locals.users);
});

// Create New User
router.post('/',
  userController.checkAndHashPassword,
  userController.createUser,
  // send an email
  (req, res) => {
    return res.status(200).send();
});

// Validate User

module.exports = router;