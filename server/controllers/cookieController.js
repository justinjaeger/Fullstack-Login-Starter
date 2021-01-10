const db = require('../connections/connect');
const users = require('../queries/userQueries');
const jwt = require('jsonwebtoken');

const cookieController = {};

// =================================== //

/**
 * Creates a new cookie based on res.locals.user_id
 * - new sessionID is created and placed in a cookie
 * - note: req.sessionID is generated randomly every time
 * - stores the user ID in req.session.user_id
 */

cookieController.createCookie = (req, res, next) => {
  res.cookie('session_id', req.sessionID, { httpOnly: true });
  req.session.user_id = res.locals.user_id;
  delete req.session.userid; // REMOVE
  return next();
};


// =================================== //

/**
 * 1. checks if we have a sessionID
 * 2. if yes, makes a request based on the userID stored in the cookie
 *  - request returns all user data
 *  - we store this in res.locals.user
 */

cookieController.validateAndReturnUser = (req, res, next) => {

  console.log('validateAndReturnUser - this is what the req.sessionID is: ', req.sessionID)
  if (req.sessionID) {
    const user_id = req.session.user_id;
    db.query(users.getUserById, [user_id], (err, result) => {
      if (result) {
        res.locals.user = result[0];
        return next();
      };
      if (err) {
        console.log('error in validateAndReturnUser', err);
        return next(err);
      };
    })
  } else {
    // then they can't log in
    return res.status(202).send({ message: 'you are not logged in' });
  };
};

// =================================== //

cookieController.removeCookie = (req, res, next) => {
  res.clearCookie('session_id');
  res.clearCookie('connect.sid');
  return next();
};

// =================================== //

module.exports = cookieController;
