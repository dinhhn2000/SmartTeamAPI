"use strict";
const express = require("express");
const router = express.Router();
const passport = require("passport");

const TeamController = require("../controllers/teams/team.controller");

// MANAGE TEAMS

router.get(
  "/list",
  passport.authenticate("jwt", { session: false }),
  TeamController.getTeamList
);
router.get(
  "/list-members",
  passport.authenticate("jwt", { session: false }),
  TeamController.getTeamMemberList
);
router.post(
  "/create",
  passport.authenticate("jwt", { session: false }),
  TeamController.createTeam
);
router.post(
  "/add-members",
  passport.authenticate("jwt", { session: false }),
  TeamController.addMembers
);

module.exports = router;
