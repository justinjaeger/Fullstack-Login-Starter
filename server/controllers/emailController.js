const { encrypt, decrypt } = require('../misc/encrypt');
const mailHelper = require('../misc/mailHelper');

const emailController = {};

// =================================== //

/**
 * - deconstructs email and username from the body
 * - encrypts and encodes the username so we can pass it into URL
 *   - function of this is so someone can't easily make this request by typing in the address box
 * - creates a url to send user to when they verify
 * - utilizes a helper function, mailHelper (check that out for all the configuration)
 * - sends the email
 */

emailController.sendVerificationEmail = (req, res, next) => {
  console.log('inside sendVerificationEmail');

  const { email, username } = req.body;

  const PORT = (process.env.NODE_ENV==="production") ? 3000 : 8080;
  const encryptedUsername = encrypt(username);
  const encodedUsername = encodeURIComponent(encryptedUsername);
  const url = `http://localhost:${PORT}/signup/verify-email/?user=${encodedUsername}`

  console.log('encrypted username: ', encryptedUsername);

  /* utilizes the helper function, which exports an object of objects based on input */
  const { transport, options } = mailHelper(email, username, url);
  
  transport.sendMail(options, (error, info) => {

    if (error) {
      console.log('error', error);
      return next(error);
    };
    
    if (info) {
      console.log('Email sent: ', info);
      return next();
    };
  });
};

// =================================== //

/**
 * - received encrypted & encoded username in the query
 * - decodes & decrypts it (should be back to the normal username now)
 * - stores normal username in res.locals.username
 */

emailController.decryptUsername = (req, res, next) => {
  console.log('inside decryptUsername');

  const { user } = req.query;

  const decoded = decodeURIComponent(user);
  const decryptedUsername = decrypt(decoded);

  console.log('decrypted username: ', decryptedUsername);

  res.locals.username = decryptedUsername;

  return next();
};

// =================================== //

module.exports = emailController;