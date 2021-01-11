const db = require('../connections/connect');
const users = require('../queries/userQueries');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const loginController = {};

// =================================== //

/**
 * - First, see if they did an email or username
 * - stores user_id in res.locals
 */

loginController.verifyUserExists = (req, res, next) => {
  console.log('verifyUserExists')

  const { emailOrUsername } = req.body;

  const entryType = (emailOrUsername.includes('@')) ? 'email' : 'username';
  const query = (entryType === 'email') ? users.getUserIdByEmail : users.getUserIdByUsername;

  db.query(query, [emailOrUsername], (err, result) => {
    if (result) {
      console.log(`found ${entryType}`, 'of user', result[0].user_id);
      res.locals.user_id = result[0].user_id;
      return next();
    };
    if (err) {
      console.log(`error finding ${entryType} in db`, err);
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
  console.log('hashPassword')
  const { password } = req.body;

  let hashedPassword = await bcrypt.hash(password, 8);
  res.locals.password = hashedPassword;

  return next();
};

// =================================== //

/**
 * - fetch the hashed password in the DB
 * - run a function comparing it with the unhashed entry from the user
 */

loginController.verifyPassword = (req, res, next) => {

  const { user_id } = res.locals;
  const { password } = req.body;

  db.query(users.getPasswordById, [user_id], (err, result) => {
    if (result) {
      const dbPassword = result[0].password;      
      bcrypt.compare(password, dbPassword, (err, result) => {
        if (result === true) {
          console.log('passwords DO match');
          return next();
        } 
        if (result === false) {
          console.log('passwords do NOT match:', 'myEntry:', password, 'dbHashedPass:', dbPassword);
          return res.status(202).send({ message : `Credentials do not match. Don't have an account? Try signing up`});
        };
        if (err) {
          console.log('err in bcrypt', err)
          return next(err);
        };
      });
    };
    if (err) {
      console.log('error in getPasswordById', err);
      return next(err);
    };
  });
};

// =================================== //

loginController.authenticateUser = (req, res, next) => {
  console.log('authenticating user')
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