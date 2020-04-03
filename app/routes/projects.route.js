"use strict";
const express = require("express");
const router = express.Router();
const jwtAuth = require("../utils/Middlewares/jwtAuth");

const ProjectController = require("../controllers/projects/project.controller");

// MANAGE PROJECTS
router.get("/list", jwtAuth, ProjectController.getProjectList);
router.get("/list-members", jwtAuth, ProjectController.getProjectMemberList);
router.post("/create", jwtAuth, ProjectController.createProject);
router.put("/update", jwtAuth, ProjectController.updateProject);
router.delete("/remove", jwtAuth, ProjectController.removeProject);
router.post("/add-members", jwtAuth, ProjectController.addMembers);
router.delete("/remove-members", jwtAuth, ProjectController.removeMembers);

module.exports = router;
