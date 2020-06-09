"use strict";
const express = require("express");
const router = express.Router();
const jwtAuth = require("../../../utils/Middlewares/jwtAuth");
const upload = require("../../../utils/Upload");

const MediaDataController = require("../controllers");

// MANAGE TASKS
router.get("/", jwtAuth, MediaDataController.getMediaData);
router.get("/list", jwtAuth, MediaDataController.getMediaDataList);
router.post("/create", jwtAuth, upload.single("media"), MediaDataController.createMediaData);
router.delete("/remove", jwtAuth, MediaDataController.removeMediaData);

module.exports = router;
