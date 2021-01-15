const db = require('../connections/connect');
const tokens = require('../queries/tokenQueries');
const jwt = require('jsonwebtoken');
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

const tokenController = {};

// =================================== //

/**
 * Creates access_token that is stored as a cookie
 * - assuming res.locals contains user_id
 * - deletes the authentication access_token if there is one
 * - creates access token
 * - creates a cookie in res.cookie
 * - saves it in the tokens db table with the user_id
 */

tokenController.createAccessToken = (req, res, next) => {
  console.log('inside createAccessToken');

  res.clearCookie('authenticated'); /* Delete the authenticated token */

  const { user_id } = res.locals;

  const accessPayload = { user_id };
  const accessOptions = { expiresIn: '10m'}; /* change the expiration here */
  const access_token = jwt.sign(accessPayload, ACCESS_TOKEN_SECRET, accessOptions);

  console.log('created access token: ', access_token);

  res.cookie('access_token', access_token, { httpOnly : true });

  db.query(tokens.createToken, [access_token, user_id], (err, result) => {
    if (result) {
      console.log('successfully saved token in db');
      return next();
    };
    if (err) {
      console.log('could not save token in db', err);
      return next(err);
    };
  });
};


// =================================== //

/** 
 * Verifies your access token (runs every time page loads)
 * - finds the token from req.headers.cookie
 * - verifies it
 * - if valid:
 *   - extracts the user data contained within the JWT and you move on
 *   - stores the user_id in res.locals.user_id
 * - if invalid:
 *   - means token is probably expired
 *   - if so, save the token in res.locals.access_token
 *   - call the getTokenFromDb function
 */

tokenController.verifyToken = (req, res, next) => {
  console.log('inside verifyToken');

  if (req.headers.cookie === undefined) return res.sendStatus(200);
  if (!req.headers.cookie.includes('access_token')) return res.sendStatus(200);

  /* NOTE: This is a pretty bad solution because theoretically we could have multiple cookies and this would not account for that */
  const access_token = req.headers.cookie.split('=')[1];

  jwt.verify(access_token, ACCESS_TOKEN_SECRET, (err, userData) => {

    if (userData) {
      console.log('token is valid. Received userData: ', userData);
      res.locals.user_id = userData.user_id;
      return next(); 
    };

    if (err) {
      /* if we get this, token is probably expired */
      console.log('token invalid: ', err.message);

      if (err.name === "TokenExpiredError") {
        res.locals.access_token = access_token;
        return tokenController.deleteTokenFromDb(req, res, next);
      };

      return next(err);
    };
  });
};

// =================================== //

/**
 * - we enter this if our token is expired
 * - first, extract access_token from res.locals
 * - second, get the user_id from the expired token. This will be needed later
 * - Now, try to delete the expired token
 *   - if it returns that 1 row was affected, that's normal, no hack
 *     - we then can clear cookies and create new access_token
 *   - if 0 rows were affected, this tells us a hacker already used the cookie, so we proceed to deleting all tokens with user_id
 */

tokenController.deleteTokenFromDb = (req, res, next) => {
  console.log('inside deleteTokenFromDb');

  const { access_token } = res.locals;

  /* Get the user_id of the expired token to store in res.locals. This is important for the NEXT middleware functions */
  jwt.verify(access_token, ACCESS_TOKEN_SECRET, {ignoreExpiration: true}, (err, userData) => {

    if (userData) {
      console.log('got the user_id of expired token: ', userData.user_id);
      res.locals.user_id = userData.user_id;
    };

    if (err) {
      console.log('could not get the user_id of expired token');
      return next(err);
    };
  });

  db.query(tokens.deleteAccessToken, [access_token], (err, result) => {

    if (result) {

      if (result.affectedRows === 0) {
      /* if we end up here, it means the token was not found. Therefore, ALREADY deleted, and a hacker got it */
        console.log('looks like this access token was already used and you got hacked');
        return tokenController.deleteAllUserTokens(req, res, next);
      };

      /* if here, it means we deleted the token and everything is normal */
      console.log('successfully deleted access token: ', result);
      res.clearCookie('access_token');
      return tokenController.createAccessToken(req, res, next);
    };

    if (err) {
      console.log('error in deleteAccessToken', err);
      return next(err);
    };
  });
};

// =================================== //

/**
 * - gets user_id from res.locals.user_id
 * - deletes every token associated with user_id
 * - this will make every active user logged out
 */

tokenController.deleteAllUserTokens = (req, res, next) => {
  console.log('inside deleteAllTokens');

  const { user_id } = res.locals;

  db.query(tokens.deleteAllUserTokens, [user_id ], (err, result) => {

    if (result) {
      console.log('successfully deleted all sessions', result);
      return res.sendStatus(404); // the 404 should redirect to the homepage
    };

    if (err) {
      console.log('could not delete all sessions', err);
      return next(err);
    };
  });
};

// =================================== //

tokenController.removeCookie = (req, res, next) => {
  console.log('inside removeCookie');

  res.clearCookie('access_token');
  
  return next();
};

// =================================== //

module.exports = tokenController;
