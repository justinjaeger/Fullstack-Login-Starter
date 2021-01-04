/**
 * All queries for changes to users / friendship tables
 */

const queries = {};

/**
 * users actions
 */

queries.getUsers = `
  SELECT * FROM users
`;

queries.createUser = `
  INSERT INTO users(username, password, dateCreated)
  VALUES(?, ?, DATE())
  RETURN *
`;

queries.getUserById = `
  SELECT * FROM users
  WHERE user_id=?
`;

queries.login = `
  INSERT INTO users(lastLoggedIn)
  VALUES(DATE())
  WHERE user_id=?
`;

queries.authenticateUser = `
  INSERT INTO users(authenticated)
  VALUES(1)
  WHERE user_id=?
`;

queries.makeAdmin = `
  INSERT INTO users(admin)
  VALUES(1)
  WHERE user_id=?
`;

queries.changePassword = `
  INSERT INTO users(password)
  VALUES(?)
  WHERE user_id=?
`;

queries.addUserImage = `
  INSERT INTO users(image)
  VALUES(?)
  WHERE user_id=?
`;

/**
 * followships actions
 */

queries.getFollowships = `
  SELECT * FROM followships
`;

queries.follow = `
  INSERT INTO followships(follower_id, followee_id, dateCreated)
  VALUES(?, ?, DATE())
  RETURN *
`;

queries.unfollow = ``;

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
queries.getFollowees = ``;