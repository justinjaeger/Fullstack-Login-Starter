const db = require('../../connections/connect');
const users = require('../../queries/userQueries');

/**
 * THE PROBLEM IS THE DB IS NOTHING
 */
const userController = {};

// =================================== //

userController.getUsers = (req, res, next) => {
  db.query(users.getUsers, (err, result) => {
    if (result) {
      console.log('result:', result);
    };
    if (err) {
      console.log('err:', err);
    };
    return next();
  });
};

// =================================== //

userController.createUser = (req, res, next) => {

  const { email, username, password } = req.body;

  db.query(users.createUser, [email, username, password], (err, result) => {
    if (result) {
      console.log('result:', result);
    };
    if (err) {
      console.log('err:', err);
    };
    return next();
  });
};

module.exports = userController;