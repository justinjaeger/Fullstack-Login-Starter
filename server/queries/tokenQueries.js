/**
 * All queries for changes to token table
 */

const queries = {};

queries.createToken = `
  INSERT INTO tokens(access_token, user_id)
  VALUES(?, ?)
`;

queries.getToken = `
  SELECT access_token
  FROM tokens
  WHERE access_token=?
`;

queries.deleteAccessToken = `
  DELETE FROM tokens
  WHERE access_token=?
`;

queries.deleteAllUserTokens = `
  DELETE FROM tokens
  WHERE user_id=?
`;

module.exports = queries;