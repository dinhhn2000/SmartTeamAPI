const passport = require("passport");
const response = require("../Responses");

module.exports = function(req, res, next) {
  passport.authenticate("jwt", function(err, user, info) {
    if (err) return next(err);
    if (!user) return response.unauthorized(res, "User not authenticated")
    req.logIn(user, function(err) {
      if (err) return next(err);
      return next();
    });
  })(req, res, next);
};
