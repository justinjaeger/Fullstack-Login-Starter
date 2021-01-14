module.exports = function profanityFilter(username) {

  const badWords = require('./profanityList')

  badWords.forEach(word => {
    if (username.includes(word) === true) {
      return true;
    };
  });
  
  return false;
};