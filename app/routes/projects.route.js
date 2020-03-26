"use strict";
const express = require("express");
const router = express.Router();
const passport = require("passport");

const ProjectController = require("../controllers/projects/project.controller");

// MANAGE PROJECTS
router.get(
  "/list",
  passport.authenticate("jwt", { session: false }),
  ProjectController.getProjectList
);
router.get(
  "/list-members",
  passport.authenticate("jwt", { session: false }),
  ProjectController.getProjectMemberList
);
router.post(
  "/create",
  passport.authenticate("jwt", { session: false }),
  ProjectController.createProject
);
router.put(
  "/update",
  passport.authenticate("jwt", { session: false }),
  ProjectController.updateProject
);
router.delete(
  "/remove",
  passport.authenticate("jwt", { session: false }),
  ProjectController.removeProject
);
router.post(
  "/add-members",
  passport.authenticate("jwt", { session: false }),
  ProjectController.addMembers
);
router.delete(
  "/remove-members",
  passport.authenticate("jwt", { session: false }),
  ProjectController.removeMembers
);

module.exports = router;
