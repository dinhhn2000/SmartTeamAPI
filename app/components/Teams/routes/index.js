"use strict";
const express = require("express");
const router = express.Router();
const jwtAuth = require("../../../utils/Middlewares/jwtAuth");

const TeamController = require("../controllers/");

// MANAGE TEAMS

router.get("/list", jwtAuth, TeamController.getTeamList);
router.get("/list-members", jwtAuth, TeamController.getTeamMemberList);
router.post("/create", jwtAuth, TeamController.createTeam);
router.post("/add-members", jwtAuth, TeamController.addMembers);
router.delete("/remove-members", jwtAuth, TeamController.removeMembers);

module.exports = router;
