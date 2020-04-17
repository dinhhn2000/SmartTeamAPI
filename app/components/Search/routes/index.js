"use strict";
const express = require("express");
const router = express.Router();
const jwtAuth = require("../../../utils/Middlewares/jwtAuth");

const SearchController = require("../controllers");

// Search by time
router.get("/project-by-time", jwtAuth, SearchController.searchProjectByTime);
router.get("/task-by-time", jwtAuth, SearchController.searchTaskByTime);
// router.get("/milestone-by-time", jwtAuth, SearchController.searchMilestoneByTime);

// Search by project

// Search by priorities
// router.get("/project-by-priority", jwtAuth, SearchController.searchProjectByPriority);

// Search by due day
// router.get("/project-by-due-day", jwtAuth, SearchController.searchProjectByPriority);




// router.get("/list-members", jwtAuth, SearchController.searchProjectMemberList);
// router.get("/progress", jwtAuth, SearchController.searchProjectProgress);
// router.get("/worked-time", jwtAuth, SearchController.searchProjectWorkedTime);

module.exports = router;
