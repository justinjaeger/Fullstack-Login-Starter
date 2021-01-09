const db = require('../connections/connect');
const users = require('../queries/userQueries');
const profanityFilter = require('../misc/profanityFilter');
const usernameFilter = require('../misc/usernameFilter');

const bcrypt = require('bcrypt');

const signupController = {};

// =================================== //

/**
 * Imports functions from the 'misc' folder
 * to determine if username is valid
 */

signupController.validateUsername = async (req, res, next) => {

  const { username } = req.body;

  const filterResult = usernameFilter(username);
  if (filterResult.status === false) {
    return res.status(202).send({ message : filterResult.message });
  };

  if (profanityFilter(username) === true) {
    return res.status(202).send({ message : 'tisk tisk. profanity is not allowed in your username'});
  };

  return next();
};

// =================================== //

/**
 * Goes through series of checks to ensure that:
 * - passwords match
 * - passwords are correct length
 * If it's not valid, will send a 202 to the front with a message
 */

signupController.validatePassword = async (req, res, next) => {

  const { password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.status(202).send({ message : 'passwords do not match'});
  };
  if (password.length < 8) {
    return res.status(202).send({ message : 'password must be more than 8 characters'});
  };
  if (password.length > 20) {
    return res.status(202).send({ message : 'password must be less than 20 characters'});
  };

  return next();
};

// =================================== //

/**
 * - Encrypts the password with bcrypt
 * - stores it via res.locals for next middleware
 */

signupController.hashPassword = async (req, res, next) => {
  
  const { password } = req.body;

  let hashedPassword = await bcrypt.hash(password, 8);
  res.locals.password = hashedPassword;

  return next();
};

// =================================== //

/**
 * - Takes the input from the frontend and creates a new user in db
 * - Handles errors that MySQL sends back
 *  - if there is an error (e.g. user already exists), we send a 202 with a message to the front
 */

signupController.createUser = (req, res, next) => {

  const { email, username } = req.body;
  const password = res.locals.password;

  db.query(users.createUser, [email, username, password], (err, result) => {
    if (result) {
      console.log('result:', result);
    };
    if (err) {
      console.log('err:', err);

      let message = 'An error occured';
      if (err.code === 'ER_DUP_ENTRY') {
        if (err.sqlMessage.split('.')[1] === `username'`) {
          message = 'This username is already registered.';
        };
        if (err.sqlMessage.split('.')[2] === `email'`) {
          message = 'This email is already registered.';
        }
      };
      // we're using 202 for sending error messages that are displayed to the user
      return res.status(202).send({ message });
    };
    return next();
  });
};

// =================================== //

signupController.sendVerificationEmail = (req, res, next) => {};

// =================================== //

module.exports = signupController;