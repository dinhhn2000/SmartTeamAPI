"use strict";
const express = require("express");
const router = express.Router();
const jwtAuth = require("../../../utils/Middlewares/jwtAuth");

const SearchController = require("../controllers");

// Search by time
router.get("/project-by-time", jwtAuth, SearchController.searchProjectByTime);
router.get("/task-by-time", jwtAuth, SearchController.searchTaskByTime);
router.get("/milestone-by-time", jwtAuth, SearchController.searchMilestoneByTime);

// Search by project

// Search by priorities
router.get("/project-by-priority", jwtAuth, SearchController.searchProjectByPriority);

// Search by due day
router.get("/project-by-due-day", jwtAuth, SearchController.searchProjectByDueDay);
router.get("/task-by-due-day", jwtAuth, SearchController.searchTaskByDueDay);

// Search by milestone
router.get("/task-by-milestone", jwtAuth, SearchController.searchTaskByMilestone);
router.get("/my-task-by-milestone", jwtAuth, SearchController.searchMyTaskByMilestone);

// Search people
router.get("/user-by-email", jwtAuth, SearchController.searchUserByEmail);
router.get("/user-by-name-team", jwtAuth, SearchController.searchUserByNameInTeam);
router.get("/user-by-name-project", jwtAuth, SearchController.searchUserByNameInProject);

module.exports = router;
