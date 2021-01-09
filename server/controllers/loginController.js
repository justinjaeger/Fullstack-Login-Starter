const db = require('../connections/connect');
const users = require('../queries/userQueries');

const jwt = require('jsonwebtoken');

const userController = {};

// =================================== //

userController.login = (req, res, next) => {

  const { user_id } = req.body;

  db.query(users.login, [user_id], (err, result) => {
    if (result) {
      console.log('result:', result);
    };
    if (err) {
      console.log('err:', err);
      return next(err);
    };
    return next();
  });
};

// =================================== //

userController.authenticateUser = (req, res, next) => {

  const { user_id } = req.body;

  db.query(users.createUser, [user_id], (err, result) => {
    if (result) {
      console.log('result:', result);
    };
    if (err) {
      console.log('err:', err);
      return next(err);
    };
    return next();
  });
};

// =================================== //

userController.checkPassword = (req, res, next) => {};

// =================================== //

userController.changePassword = (req, res, next) => {

  const { password, user_id } = req.body;

  db.query(users.changePassword, [password, user_id], (err, result) => {
    if (result) {
      console.log('result:', result);
    };
    if (err) {
      console.log('err:', err);
      return next(err);
    };
    return next();
  });
};

// =================================== //

module.exports = userController;