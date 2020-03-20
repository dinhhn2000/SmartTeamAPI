"use strict";
const express = require("express");
const router = express.Router();
const passport = require("passport");

const ProfileController = require("../controllers/projects/project.controller");

// MANAGE PROJECTS
router.get(
  "/list",
  passport.authenticate("jwt", { session: false }),
  ProfileController.getProjectList
);
router.get(
  "/list-members",
  passport.authenticate("jwt", { session: false }),
  ProfileController.getProjectMemberList
);
router.post(
  "/create",
  passport.authenticate("jwt", { session: false }),
  ProfileController.createProject
);
router.post(
  "/add-members",
  passport.authenticate("jwt", { session: false }),
  ProfileController.addMembers
);
router.put(
  "/update",
  passport.authenticate("jwt", { session: false }),
  ProfileController.updateProject
);

module.exports = router;