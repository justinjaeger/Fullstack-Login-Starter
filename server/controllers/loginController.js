const db = require('../connections/connect');
const users = require('../queries/userQueries');
const bcrypt = require('bcrypt');

const loginController = {};

// =================================== //

/**
 * - First, see if they did an email or username
 * - based on input, make request from DB to get user_id
 * - if it fails, we know the user does not exist
 * - store user_id in res.locals
 */

loginController.verifyUserAndStoreUserId = (req, res, next) => {
  console.log('inside verifyUserAndStoreUserId');
  const { emailOrUsername } = req.body;

  const entryType = (emailOrUsername.includes('@')) ? 'email' : 'username';
  const query = (entryType === 'email') ? users.getUserIdByEmail : users.getUserIdByUsername;

  db.query(query, [emailOrUsername], (err, result) => {
    if (result) {
      if (result[0] === undefined) {
        // if we go in here, it means the user doesn't exist
        console.log(`error finding ${entryType} in db`, err);
        return res.status(202).send({ message : `Credentials do not match. Don't have an account? Try signing up`});
      };
      console.log(`found ${entryType}`, 'of user', result[0].user_id);
      res.locals.user_id = result[0].user_id;
      return next();
    };
    if (err) {
      console.log('error in verifyUserAndStoreUserId', err);
      return next(err);
    };
  });
};

// =================================== //

/**
 * - use res.locals.user_id to fetch the hashed password in the DB
 * - use bcrypt to compare passwords
 * - if it can't find the user, it should send a message back
 */

loginController.verifyPassword = (req, res, next) => {
  console.log('inside verifyPassword');
  const { user_id } = res.locals;
  const { password } = req.body;

  db.query(users.getPasswordById, [user_id], (err, result) => {
    if (result) {
      console.log('RESULT:',result)
      const dbPassword = result[0].password;      
      bcrypt.compare(password, dbPassword, (err, result) => {
        if (result === true) {
          console.log('passwords DO match');
          return next();
        };
        if (result === false) {
          console.log('passwords do NOT match:', 'myEntry:', password, 'dbHashedPass:', dbPassword);
          return res.status(202).send({ message : `Credentials do not match. Don't have an account? Try signing up`});
        };
        if (err) {
          console.log(`err in bcrypt while comparing ${password} and ${dbPassword}`, err);
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

/**
 * - assumes user_id is in res.locals.user_id
 * - uses user_id to fetch all user info from db
 * - makes password field null cause we don't need that or want to expose it
 */

loginController.returnUserData = (req, res, next) => {
  console.log('inside returnUserData');
  const { user_id } = res.locals;

  db.query(users.getUserById, [user_id], (err, result) => {
    if (result) {
      const userData = result[0];
      userData.password = null;
      res.locals.userData = userData;
      console.log('successfully retrieved user info. sending this back:', res.locals.userData)
      return next();
    };
    if (err) {
      console.log('error in returnUserData', err);
      return next(err);
    };
  });
};

// =================================== //

module.exports = loginController;