const db = require('../connections/connect');
const users = require('../queries/userQueries');
const jwt = require('jsonwebtoken');
const { NoFragmentCyclesRule } = require('graphql');
const path = require('path');
require('dotenv').config({
  path: path.resolve(__dirname, '../../.env')
});
const TOKEN_SECRET = process.env.TOKEN_SECRET;

const tokenController = {};

// =================================== //

/**
 * - assuming res.locals contains user_id
 * - creates JWT token
 * - stores it in res.locals.token
 */

tokenController.createJWT = (req, res, next) => {

  const user_id = res.locals.user_id;
  const payload = { user_id };

  const accessToken = jwt.sign(payload, TOKEN_SECRET);
  // ^^ this automatically puts a field called iat in the payload, which I think is automatically the expiration time
  console.log('created token: ', accessToken);

  res.cookie('access_token', accessToken, { httpOnly : true });

  res.locals.token = accessToken;
  return next();
};


// =================================== //

/** 
 * - finds the token from req.headers.cookie
 * - verifies it
 * - if valid, extracts the user data contained within the JWT 
 * - stores the user_id in res.locals.user_id
*/

tokenController.verifyJWT = (req, res, next) => {

  const access_token = req.headers.cookie.split('=')[1];

  jwt.verify(access_token, TOKEN_SECRET, (err, userData) => {
    if (userData) {
      console.log('token is valid. Received userData: ', userData);
      res.locals.user_id = userData.user_id;
      return next();
    };
    if (err) {
      console.log('token invalid', err);
      return res.sendStatus(403);
    };
  });
};

// =================================== //

tokenController.removeCookie = (req, res, next) => {
  res.clearCookie('access_token');
  return next();
};

// =================================== //

module.exports = tokenController;
