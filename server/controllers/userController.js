const db = require('../connections/connect');
const users = require('../queries/userQueries');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

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

/**
 * Edge cases:
 * - email or username is already in use
 * - password is shorter than 8 characters but not longer than 20
 * - if the passwords are not identical
 * - do this by sending a message back
 *  - res.render('/url', { message: 'text ' })
 * Must also:
 * - hash the password
 */

userController.checkAndHashPassword = async (req, res, next) => {
  
  const { password, confirmPassword } = req.body;

  // check if password is valid
  if (password !== confirmPassword) {
    return res.status(202).send({ message : 'passwords do not match'});
  };
  if (password.length < 8) {
    return res.status(202).send({ message : 'password must be more than 8 characters'});
  };
  if (password.length > 20) {
    return res.status(202).send({ message : 'password must be less than 20 characters'});
  };

  // hash password
  let hashedPassword = await bcrypt.hash(password, 8);
  // send to res.locals
  res.locals.password = hashedPassword;

  return next();
};

// =================================== //

userController.createUser = (req, res, next) => {

  const { email, username } = req.body;
  const password = res.locals.password;

  db.query(users.createUser, [email, username, password], (err, result) => {
    if (result) {
      console.log('result:', result);
    };
    if (err) {
      // will catch duplicates in unique
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