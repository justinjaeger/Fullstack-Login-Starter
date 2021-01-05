const express = require("express");
const router = express.Router();

/**
 * Require controllers below
 */
const userController = require('./controllers/userController');

/**
 * All /user routes
 */

router.get('/',
  userController.getUsers,
  (req, res) => {
    console.log('inside userRouter');
    return res.sendStatus(200).json(res.locals.data);
});

router.post('/',
  userController.createUser,
  (req, res) => {
  return res.json();
});

module.exports = router;