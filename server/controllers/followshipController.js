const db = require('../connections/connect');
const followships = require('../queries/followshipQueries');

const followshipController = {};

// =================================== //

followshipController.getAllFollowships = (req, res, next) => {
  db.query(followships.getAllFollowships, (err, result) => {
    if (result) {
      console.log('result:', result);
    };
    if (err) {
      console.log('err:', err);
      return next(err);
    };
    return next();
  });
};

// =================================== //

followshipController.follow = (req, res, next) => {

  const { follower_id, followee_id } = req.body;

  db.query(followships.follow, [follower_id, followee_id], (err, result) => {
    if (result) {
      console.log('result:', result);
    };
    if (err) {
      console.log('err:', err);
      return next(err);
    };
    return next();
  });
};

// =================================== //

followshipController.unfollow = (req, res, next) => {

  const { follower_id, followee_id } = req.body;

  db.query(followships.unfollow, [follower_id, followee_id], (err, result) => {
    if (result) {
      console.log('result:', result);
    };
    if (err) {
      console.log('err:', err);
      return next(err);
    };
    return next();
  });
};

// =================================== //

followshipController.getFollowers = (req, res, next) => {

  const { followee_id } = req.body;

  db.query(followships.unfollow, [followee_id], (err, result) => {
    if (result) {
      console.log('result:', result);
    };
    if (err) {
      console.log('err:', err);
      return next(err);
    };
    return next();
  });
};

// =================================== //

followshipController.getFollowees = (req, res, next) => {

  const { follower_id } = req.body;

  db.query(followships.unfollow, [follower_id], (err, result) => {
    if (result) {
      console.log('result:', result);
    };
    if (err) {
      console.log('err:', err);
      return next(err);
    };
    return next();
  });
};

// =================================== //

module.exports = followshipController;