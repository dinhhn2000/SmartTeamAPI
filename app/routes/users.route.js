const express = require("express");
const router = express.Router();
const passport = require("passport");

const UserController = require("../controllers/users/user.controller");
const ProfileController = require("../controllers/users/profile.controller");

var multer = require("multer");
var upload = multer({ dest: "uploads/" });

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
  res.json({ result: "OK" });
});
router.post("/verify/resend", UserController.verifyAccountResend);
router.post("/verify", UserController.verifyAccount);

// MANAGE PROFILE
router.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  ProfileController.getProfile
);
router.post(
  "/profile/update",
  passport.authenticate("jwt", { session: false }),
  ProfileController.updateProfile
);
router.post(
  "/profile/update-avatar",
  passport.authenticate("jwt", { session: false }),
  upload.single("avatar"),
  ProfileController.updateAvatar
);
router.post("/change-password", UserController.changePassword);
router.post("/change-password/verify", UserController.verifyChangePassword);
router.post(
  "/set-role",
  passport.authenticate("jwt", { session: false }),
  ProfileController.setRole
);

module.exports = router;
