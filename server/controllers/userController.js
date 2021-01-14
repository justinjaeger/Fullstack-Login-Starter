const db = require('../connections/connect');
const users = require('../queries/userQueries');

const jwt = require('jsonwebtoken');

const userController = {};

// =================================== //

userController.getUsers = (req, res, next) => {
  db.query(users.getUsers, (err, result) => {
    if (result) {
      console.log('result:', result);
      res.locals.users = result;
    };
    if (err) {
      console.log('err:', err);
      return next(err);
    };
    return next();
  });
};

// =================================== //

userController.getuserById = (req, res, next) => {

  const { user_id } = req.body;

  db.query(users.getUserById, [user_id], (err, result) => {
    if (result) {
      console.log('result:', result);
      res.locals.result = result;
    };
    if (err) {
      console.log('err:', err);
      return next(err);
    };
    return next();
  });
};

// =================================== //

userController.makeAdmin = (req, res, next) => {

  const { user_id } = req.body;

  db.query(users.makeAdmin, [user_id], (err, result) => {
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

userController.addUserImage = (req, res, next) => {

  const { image, user_id } = req.body;

  db.query(users.addUserImage, [image, user_id], (err, result) => {
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