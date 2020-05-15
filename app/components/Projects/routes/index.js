"use strict";
const express = require("express");
const router = express.Router();
const jwtAuth = require("../../../utils/Middlewares/jwtAuth");
const asyncMiddleware = require("../../../utils/Middlewares/asyncMiddleware");

const ProjectController = require("../controllers");

// MANAGE PROJECTS
router.get("/", jwtAuth, asyncMiddleware(ProjectController.getProject));
router.get("/list", jwtAuth, asyncMiddleware(ProjectController.getProjectList));
router.get(
  "/list-not-members",
  jwtAuth,
  asyncMiddleware(ProjectController.getProjectNotMemberList)
);
router.get("/list-members", jwtAuth, asyncMiddleware(ProjectController.getProjectMemberList));
router.get("/progress", jwtAuth, asyncMiddleware(ProjectController.getProjectProgress));
router.get("/worked-time", jwtAuth, asyncMiddleware(ProjectController.getProjectWorkedTime));
router.post("/create", jwtAuth, asyncMiddleware(ProjectController.createProject));
router.put("/update", jwtAuth, asyncMiddleware(ProjectController.updateProject));
router.delete("/remove", jwtAuth, asyncMiddleware(ProjectController.removeProject));
router.post("/add-members", jwtAuth, asyncMiddleware(ProjectController.addMembers));
router.post("/add-admins", jwtAuth, asyncMiddleware(ProjectController.addAdmins));
router.delete("/remove-members", jwtAuth, asyncMiddleware(ProjectController.removeMembers));

module.exports = router;
