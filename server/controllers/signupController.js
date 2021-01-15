const db = require('../connections/connect');
const users = require('../queries/userQueries');
const profanityFilter = require('../misc/profanityFilter');
const usernameFilter = require('../misc/usernameFilter');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

const signupController = {};

// =================================== //

/**
 * - determines whether username is valid (no profanity, etc)
 * - note: Imports helper functions from the 'misc' folder
 */

signupController.validateEmailAndUsername = async (req, res, next) => {
  console.log('inside validateUsername');
  const { email, username } = req.body;

  if (!email.includes('@') || !email.includes('.') ) {
    return res.status(202).send({ message : 'this email is not properly formatted' });
  };

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
 * - on the frontend, 202 messages are programmed to be shown to the user
 */

signupController.validatePassword = async (req, res, next) => {
  console.log('inside validatePassword');
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
 * - stores it in res.locals.password for next middleware
 */

signupController.hashPassword = async (req, res, next) => {
  console.log('inside hashPassword');
  const { password } = req.body;

  await bcrypt.hash(password, 8, (err, hash) => {
    if (err) {
      console.log('error encrypting password');
      return next(err);
    };
    if (hash) {
      console.log('successfully hashed password', hash)
      res.locals.hashedPassword = hash;
      return next();
    };
  });
};

// =================================== //

/**
 * - Takes the email / username from the frontend
 * - takes the hashedPassword from the previous middleware
 * - With them, creates user in DB
 *  - (next middleware will actually send us the user_id)
 * - Handles errors that MySQL sends back
 * - if there is an error (e.g. user already exists), we send a 202 with a message to the front
 */

signupController.createUser = (req, res, next) => {
  console.log('inside createUser');
  const { email, username } = req.body;
  const password = res.locals.hashedPassword;

  db.query(users.createUser, [email, username, password], (err, result) => {
    if (result) {
      console.log(`successfully created user: ${username}`);
      return next();
    };
    if (err) {
      console.log('error in createUser', err);
      let message = 'An error occured';
      if (err.code === 'ER_DUP_ENTRY') {
        if (err.sqlMessage.split('.')[1] === `username'`) {
          message = 'This username is already registered.';
        };
        if (err.sqlMessage.split('.')[2] === `email'`) {
          message = 'This email is already registered.';
        }
      };
      return res.status(202).send({ message });
    };
  });
};

// =================================== //

signupController.sendVerificationEmail = (req, res, next) => {
  console.log('inside sendVerificationEmail');
  const { email, username } = req.body;

  const transport = nodemailer.createTransport({
    host: process.env.MAILTRAP_HOST,
    port: process.env.MAILTRAP_PORT,
    auth: {
      user: process.env.MAILTRAP_AUTH_USER,
      pass: process.env.MAILTRAP_AUTH_PASSWORD
    }
  });
  
  const mailOptions = {
    from: '"Example Team" <noreply@website.com>',
    to: `${email}`,
    subject: 'Verify your email',
    text: `Hi, ${username}. Please click the link to verify your email`, 
    html: `
      <b>Hey there! </b>
      <div>Click this link to verify your email</div>
      <button><a href="http://localhost:8080/signup/verify-email/${username}">Verify account</a></button>
    `,
  };
  
  transport.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('error', error);
      return next(error);
    };
    if (info) {
      console.log('Email sent: ' + info);
      return next();
    };
  });
};

// =================================== //

/**
 * - takes the username from params
 * - authenticates the user
 */

signupController.authenticateUser = (req, res, next) => {
  console.log('inside authenticateUser');
  const { username } = res.locals;
  
  db.query(users.authenticateUser, [username], (err, result) => {
    if (result) {
      console.log('should have authenticated user: ', result);
      return next();
    };
    if (err) {
      console.log('error in authenticateUser', err);
      return next(err);
    };
  });
};

// =================================== //

/**
 * - uses username input to get the user_id
 * - stores user_id in res.locals
 */

signupController.getUserIdByUsername = (req, res, next) => {
  console.log('inside getUserIdByUsername');
  const { username } = req.body;

  db.query(users.getUserIdByUsername, [username], (err, result) => {
    if (result) {
      const { user_id } = result[0];
      res.locals.user_id = user_id;
      return next();
    };
    if (err) {
      console.log('error in getUserIdByUsername', err);
      return next(err);
    };
  });
};

// =================================== //

/**
 * - user_id sent in body
 * - deletes the user's account
 * - make sure to protect this route 
 */

signupController.deleteAccount = (req, res, next) => {
  console.log('inside deleteAccount');
  const { user_id } = req.body;

  db.query(users.deleteAccount, [user_id], (err, result) => {
    if (result) {
      if (result.affectedRows === 0) {
        console.log('Could not find account to delete', err);
        return next({ message : 'Error: could not delete account' });
      };
      console.log('successfully deleted account')
      return next();
    };
    if (err) {
      console.log('error in deleteAccount', err);
      return next(err);
    };
  });
};

// =================================== //

module.exports = signupController;