/**
 * All queries for changes to users / friendship tables
 */

const queries = {};

queries.getAllFollowships = `
  SELECT * FROM followships
`;

queries.follow = `
  INSERT INTO followships(follower_id, followee_id, dateCreated)
  VALUES(?, ?, DATE())
  RETURN *
`;

queries.unfollow = `
  DELETE FROM followships
  WHERE follower_id=? AND followee_id=?
`;

// get people who follow me
queries.getFollowers = `
  SELECT username
  FROM users
  INNER JOIN followships
  ON users.user_id = followships.follower_id
  WHERE followee_id=?
  ORDER BY DATE(dateCreated) DESC
`;

// get people who I follow
queries.getFollowees = `
  SELECT username
  FROM users
  INNER JOIN followships
  ON users.user_id = followships.followee_id
  WHERE follower_id=?
  ORDER BY DATE(dateCreated) DESC
`;

module.exports = queries;