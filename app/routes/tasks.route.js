"use strict";
const express = require("express");
const router = express.Router();
const passport = require("passport");

const TaskController = require("../controllers/tasks/task.controller");

// MANAGE TASKS
router.get(
  "/list",
  passport.authenticate("jwt", { session: false }),
  TaskController.getTaskList
);
router.get(
  "/list-members",
  passport.authenticate("jwt", { session: false }),
  TaskController.getTaskMemberList
);
router.post(
  "/create",
  passport.authenticate("jwt", { session: false }),
  TaskController.createTask
);
router.put(
  "/update",
  passport.authenticate("jwt", { session: false }),
  TaskController.updateTask
);
router.delete(
  "/remove",
  passport.authenticate("jwt", { session: false }),
  TaskController.removeTask
);
router.post(
  "/add-members",
  passport.authenticate("jwt", { session: false }),
  TaskController.addMembers
);
router.delete(
  "/remove-members",
  passport.authenticate("jwt", { session: false }),
  TaskController.removeMembers
);

module.exports = router;
