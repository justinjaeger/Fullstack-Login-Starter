const nodemailer = require('nodemailer');

/**
 * Exports an object with all the mail configurations we need
 */

const verificationEmail = (email, username, url) => {

  const obj = {};

  obj.transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: process.env.MAILTRAP_AUTH_USER,
      pass: process.env.MAILTRAP_AUTH_PASSWORD
    }
  });

  obj.options = {
    from: '"Login App" <noreply@website.com>',
    to: `${email}`,
    subject: 'Verify your email',
    text: `Hi, ${username}. Please click the link to verify your email`, 
    html: `
      <b>Hey there! </b>
      <div>Click this link to verify your email</div>
      <button><a href="${url}">Verify Email</a></button>
    `,
  };

  return obj;
};

module.exports = verificationEmail;