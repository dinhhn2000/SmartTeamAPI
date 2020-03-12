const express = require("express");
const router = express.Router();
const passport = require("passport");

const UserController = require("../controllers/users/user.controller");
const ProfileController = require("../controllers/users/profile.controller");

/* GET users listing. */
router.get("/", function(req, res, next) {
  res.send("respond with a resource");
});

// AUTHENTICATION
router.post("/sign-up", UserController.signUp);
router.post("/sign-in", UserController.signIn);
router.post("/sign-in-google", UserController.signInGoogle);
router.post("/sign-in-facebook", UserController.signInFacebook);
router.get("/sign-out", function(req, res) {
  req.logout();
  res.redirect("/");
});

// MANAGE PROFILE
// router.get(
//   "/profile",
//   passport.authenticate("jwt", {
//     session: false
//   }),
//   ProfileController
// );

module.exports = router;
