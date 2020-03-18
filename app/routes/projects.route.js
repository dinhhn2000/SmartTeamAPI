const express = require("express");
const router = express.Router();
const passport = require("passport");

const UserController = require("../controllers/users/user.controller");
const ProfileController = require("../controllers/projects/project.controller");

// MANAGE PROJECTS
router.get(
  "/create",
  passport.authenticate("jwt", { session: false }),
  ProfileController.createProject
);

module.exports = router;
