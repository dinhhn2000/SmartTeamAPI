"use strict";
const express = require("express");
const router = express.Router();
const jwtAuth = require("../../../utils/Middlewares/jwtAuth");

const ProjectController = require("../controllers");

// MANAGE PROJECTS
router.get("/", jwtAuth, ProjectController.getProject);
router.get("/list", jwtAuth, ProjectController.getProjectList);
router.get("/list-not-members", jwtAuth, ProjectController.getProjectNotMemberList);
router.get("/list-members", jwtAuth, ProjectController.getProjectMemberList);
router.get("/progress", jwtAuth, ProjectController.getProjectProgress);
router.get("/worked-time", jwtAuth, ProjectController.getProjectWorkedTime);
router.post("/create", jwtAuth, ProjectController.createProject);
router.put("/update", jwtAuth, ProjectController.updateProject);
router.delete("/remove", jwtAuth, ProjectController.removeProject);
router.post("/add-members", jwtAuth, ProjectController.addMembers);
router.delete("/remove-members", jwtAuth, ProjectController.removeMembers);

module.exports = router;
