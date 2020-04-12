"use strict";
const express = require("express");
const router = express.Router();
const jwtAuth = require("../../../utils/Middlewares/jwtAuth");

const TaskController = require("../controllers");

// MANAGE TASKS
router.get("/", jwtAuth, TaskController.getTask);
router.get("/list", jwtAuth, TaskController.getTaskList);
router.get("/list-members", jwtAuth, TaskController.getTaskMember);
router.post("/create", jwtAuth, TaskController.createTask);
router.put("/update", jwtAuth, TaskController.updateTask);
router.put("/update-progress", jwtAuth, TaskController.updateProgressTask);
router.delete("/remove", jwtAuth, TaskController.removeTask);
router.post("/add-members", jwtAuth, TaskController.addMember);
router.post("/update-members", jwtAuth, TaskController.updateMember);
router.delete("/remove-members", jwtAuth, TaskController.removeMember);

module.exports = router;
