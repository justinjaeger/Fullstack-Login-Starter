const CryptoJS = require("crypto-js");

const crypto = {}

crypto.encrypt = (text) => {
  const result = CryptoJS.AES.encrypt(text, process.env.CRYPTO_SECRET).toString();
  return result;
};

crypto.decrypt = (encryptedString) => {
  const bytes  = CryptoJS.AES.decrypt(encryptedString, process.env.CRYPTO_SECRET);
  const originalText = bytes.toString(CryptoJS.enc.Utf8);
  return originalText;
};

module.exports = crypto;