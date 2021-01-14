const express = require("express");
const router = express.Router();

const userController = require('../controllers/userController');

// See all users
router.get('/',
  userController.getUsers,
  (req, res) => {
    console.log('inside userRouter');
    return res.send(res.locals.users);
});

module.exports = router;