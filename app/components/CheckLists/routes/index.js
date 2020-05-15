"use strict";
const express = require("express");
const router = express.Router();
const jwtAuth = require("../../../utils/Middlewares/jwtAuth");

const CheckListController = require("../controllers");

// MANAGE TASKS
router.get("/list", jwtAuth, CheckListController.getCheckListList);
router.post("/create", jwtAuth, CheckListController.createCheckList);
router.put("/update", jwtAuth, CheckListController.updateCheckList);
router.delete("/remove", jwtAuth, CheckListController.removeCheckList);

module.exports = router;
