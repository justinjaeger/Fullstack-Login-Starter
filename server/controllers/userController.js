const db = require('../connections/connect');
const users = require('../queries/userQueries');

const userController = {};

// =================================== //

userController.getUsers = (req, res, next) => {
  db.query(users.getUsers, (err, result) => {
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

/**
 * Edge cases:
 * - email or username is already in use
 * - password is shorter than 8 characters
 * - if the passwords are not identical
 * - do this by sending a message back
 *  - res.render('/url', { message: 'text ' })
 * Must also:
 * - hash the password
 */

userController.createUser = (req, res, next) => {

  const { email, username, password, confirmPassword } = req.body;

  db.query(users.createUser, [email, username, password], (err, result) => {
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