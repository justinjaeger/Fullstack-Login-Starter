const db = require('../connections/connect');
const users = require('../queries/userQueries');
const nodemailer = require('nodemailer');
const { encrypt, decrypt } = require('../misc/encrypt');
const PORT = (process.env.NODE_ENV==="production") ? 3000 : 8080;

const emailController = {};

// =================================== //

/**
 * 
 */

emailController.sendVerificationEmail = (req, res, next) => {
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

  const encryptedUsername = encrypt(username);
  const encoded = encodeURIComponent(encryptedUsername);

  console.log('encrypted username: ', encryptedUsername);
  console.log('we are using this port:', PORT);
  const mailOptions = {
    from: '"Movie Expert" <noreply@website.com>',
    to: `${email}`,
    subject: 'Verify your email',
    text: `Hi, ${username}. Please click the link to verify your email`, 
    html: `
      <b>Hey there! </b>
      <div>Click this link to verify your email</div>
      <button><a href="http://localhost:${PORT}/signup/verify-email/?user=${encoded}">Verify account</a></button>
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
 * - received encrypted username in the params
 * - decrypts it
 * - stores normal username in res.locals.username
 */

emailController.decryptUsername = (req, res, next) => {
  console.log('inside decryptUsername');
  const { user } = req.query;

  console.log('query:',user);

  const decoded = decodeURIComponent(user);
  const decryptedUsername = decrypt(decoded);
  console.log('decrypted username: ', decryptedUsername);

  res.locals.username = decryptedUsername;
  return next();
};

// =================================== //

module.exports = emailController;