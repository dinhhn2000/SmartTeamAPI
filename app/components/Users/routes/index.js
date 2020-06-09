"use strict";
const express = require("express");
const router = express.Router();
const jwtAuth = require("../../../utils/Middlewares/jwtAuth");
const upload = require("../../../utils/Upload");

const UserController = require("../controllers");
const ProfileController = require("../../Profiles/controllers");

// AUTHENTICATION
router.post("/sign-up", UserController.signUp);
router.post("/sign-in", UserController.signIn);
router.post("/sign-in-google", UserController.signInGoogle);
router.post("/sign-in-facebook", UserController.signInFacebook);
router.get("/sign-out", function (req, res) {
  req.logout();
  res.json({ result: "OK" });
});
router.post("/verify/resend", UserController.verifyAccountResend);
router.post("/verify", UserController.verifyAccount);

// MANAGE PROFILE
router.get("/profile", jwtAuth, ProfileController.getProfile);
router.post("/profile/update", jwtAuth, ProfileController.updateProfile);
router.post(
  "/profile/update-avatar",
  jwtAuth,
  upload.single("avatar"),
  ProfileController.updateAvatar
);
router.post("/change-password", UserController.changePassword);
router.post("/change-password/verify", UserController.verifyChangePassword);

module.exports = router;
