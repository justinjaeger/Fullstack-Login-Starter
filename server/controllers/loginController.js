const db = require('../connections/connect');
const users = require('../queries/userQueries');
const bcrypt = require('bcrypt');

const loginController = {};

// =================================== //

/**
 * Basically checks if the login credentials match an entry in the db
 * - First, see if user entered an email or username
 * - based on input, make request from DB to get user_id
 * - if it fails, we know the user does not exist
 * - if not, store user_id in res.locals
 */

loginController.verifyUserAndStoreUserId = (req, res, next) => {
  console.log('inside verifyUserAndStoreUserId');

  const { emailOrUsername } = req.body;

  const entryType = (emailOrUsername.includes('@')) ? 'email' : 'username';
  const query = (entryType === 'email') ? users.getUserIdByEmail : users.getUserIdByUsername;

  db.query(query, [emailOrUsername], (err, result) => {

    if (result) {

      if (result[0] === undefined) {
        /* if we go in here, it means the user doesn't exist */
        console.log(`error finding ${entryType} in db`, err);
        return res.status(202).send({ message : `Credentials do not match`});
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
 * Checks that the password you entered matches the one in the db
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

      const dbPassword = result[0].password;      

      bcrypt.compare(password, dbPassword, (err, result) => {

        if (result === true) {
          console.log('passwords DO match');
          return next();
        };

        if (result === false) {
          console.log('passwords do NOT match:', 'myEntry:', password, 'dbHashedPass:', dbPassword);
          return res.status(202).send({ message : `Credentials do not match`});
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
 * - checks if authenticated=1 in the db
 * - if yes, proceed
 * - if not, send a message back to the client that they need to authenticate first, with the option to re-send the email
 */

loginController.verifyEmailAuthenticated = (req, res, next) => {
  console.log('inside verifyEmailAuthenticated');
  const { user_id } = res.locals;

  db.query(users.verifyAuthentication, [user_id], (err, result) => {

    if (result) {

      const status = result[0].authenticated[0];      

      if (status === 1) {
        return next();
      };

      if (status === 0) {
        // get the email and username
        const email = result[0].email;
        const username = result[0].username;
        return res.status(202).send({ 
          message: `Please verify the email sent to ${email}.`,
          email: email,
          username: username,
        });
      };
      
    };

    if (err) {
      console.log('error in verifyEmailAuthenticated', err);
      return next(err);
    };
  });
};

// =================================== //

/**
 * Returns all the user's data except the password
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

/**
 * Attempts to get the user_id 
 * - if it returns nothing, it doesn't exist
 *   - because we dont want someone to be able to figure out whose email is valid and whose isn't, we send back a message saying we sent the email even if we didn't
 * - if it returns a user_id, we proceed to next middleware
 */

loginController.ifEmailNoExistDontSend = (req, res, next) => {
  console.log('inside ifEmailNoExistDontSend');
  
  const { email } = req.body;

  db.query(users.getUserIdByEmail, [email], (err, result) => {

    if (result) {

      if (result[0] === undefined) {
        /* if we go in here, it means the user doesn't exist */
        console.log(`did not find email in db`, err);
        return res.status(200).send({ message : `An email was sent to ${email}. Didn't receive email? Make sure address is correct.`});
      };

      console.log('found email in db', result[0].user_id);
      return next();
    };

    if (err) {
      console.log('error in ifEmailNoExistDontSend', err);
      return next(err);
    };
  });
};

// =================================== //

loginController.updatePassword = (req, res, next) => {
  console.log('inside updatePassword');

  const { hashedPassword, user_id } = res.locals;

  db.query(users.updatePassword, [hashedPassword, user_id], (err, result) => {

    if (result) {
      if (result.affectedRows > 0) {
        console.log('updated password successfully', result);
        return next();
      };
      console.log('when updating password, did not effect any rows');
      return next({message: 'when updating password, did not effect any rows'});
    };

    if (err) {
      console.log('error in updatePassword', err);
      return next(err);
    };
  });
};

// =================================== //

module.exports = loginController;