const db = require('../connections/connect');
const users = require('../queries/userQueries');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const loginController = {};

// =================================== //

/**
 * - First, see if they did an email or username
 * - it should return the userId either way, which we store in res.locals
 */

loginController.verifyUserExists = (req, res, next) => {

  const { emailOrUsername } = req.body;

  const entryType = (emailOrUsername.includes('@')) ? 'email' : 'username';
  const query = (entryType === 'Email') ? users.getUserIdByEmail : users.getUserIdByUsername;

  db.query(query, [emailOrUsername], (err, result) => {
    if (result) {
      console.log(`found ${entryType}`, result[0]);
      res.locals.user_id = result[0];
      return next();
    };
    if (err) {
      console.log(`error finding ${entryType}`, err);
      return res.status(202).send({ message : `Credentials do not match. Don't have an account? Try signing up`});
    };
  });
};

// =================================== //

/**
 * - Encrypts the password with bcrypt
 * - stores it in res.locals.password for next middleware
 */

loginController.hashPassword = async (req, res, next) => {
  
  const { password } = req.body;

  let hashedPassword = await bcrypt.hash(password, 8);
  res.locals.password = hashedPassword;

  return next();
};

// =================================== //

/**
 * - 
 */

loginController.verifyPassword = (req, res, next) => {

  const { user_id, password } = res.locals;

  db.query(users.getPasswordById, [user_id], (err, result) => {
    if (result) {
      console.log('got password from db:', result[0]);
      const dbPassword = result[0];
      if (password === dbPassword) {
        console.log('passwords match!');
        return next();
      } else {
        console.log('passwords do not match');
        return res.status(202).send({ message : `Credentials do not match. Don't have an account? Try signing up`});
      }
      return next();
    };
    if (err) {
      console.log('error in getPasswordById', err);
      return next(err);
    };
  });
};

// =================================== //

loginController.authenticateUser = (req, res, next) => {

  const { user_id } = req.body;

  db.query(users.createUser, [user_id], (err, result) => {
    if (result) {
      console.log('result:', result[0]);
      return next();
    };
    if (err) {
      console.log('err:', err);
      return next(err);
    };
  });
};

// =================================== //

loginController.checkPassword = (req, res, next) => {};

// =================================== //

loginController.changePassword = (req, res, next) => {

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

module.exports = loginController;