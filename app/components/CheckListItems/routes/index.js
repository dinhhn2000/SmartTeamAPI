"use strict";
const express = require("express");
const router = express.Router();
const jwtAuth = require("../../../utils/Middlewares/jwtAuth");

const CheckListItemController = require("../controllers");

// MANAGE TASKS
router.get("/", jwtAuth, CheckListItemController.getCheckListItem);
router.get("/list", jwtAuth, CheckListItemController.getCheckListItemList);
router.post("/create", jwtAuth, CheckListItemController.createCheckListItem);
router.put("/update", jwtAuth, CheckListItemController.updateCheckListItem);
router.delete("/remove", jwtAuth, CheckListItemController.removeCheckListItem);

module.exports = router;
