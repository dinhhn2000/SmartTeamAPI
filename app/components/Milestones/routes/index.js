"use strict";
const express = require("express");
const router = express.Router();
const jwtAuth = require("../../../utils/Middlewares/jwtAuth");

const MilestoneController = require("../controllers");

// MANAGE TASKS
router.get("/", jwtAuth, MilestoneController.getMilestone);
router.get("/list", jwtAuth, MilestoneController.getMilestoneList);
router.post("/create", jwtAuth, MilestoneController.createMilestone);
router.put("/update", jwtAuth, MilestoneController.updateMilestone);
router.delete("/remove", jwtAuth, MilestoneController.removeMilestone);

module.exports = router;
