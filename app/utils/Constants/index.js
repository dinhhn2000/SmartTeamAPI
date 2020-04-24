"use strict";
require("dotenv").config();

module.exports = {
  dbName: process.env.DB_NAME,
  dbUserName: process.env.DB_USERNAME,
  dbPassword: process.env.DB_PASSSWORD,
  dbHost: process.env.DB_HOST,
  dbDialect: process.env.DB_DIALECT,
  JWT_SECRET: process.env.JWT_SECRET || "jwt_secret",
  expireTime: process.env.EXPIRE_TIME || 300,
  facebookClientId: process.env.FACEBOOK_CLIENT_ID,
  facebookClientSecret: process.env.FACEBOOK_CLIENT_SECRET,
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  cloudinaryName: process.env.CLOUDINARY_CLOUD_NAME,
  cloudinaryKey: process.env.CLOUDINARY_API_KEY,
  cloudinarySecret: process.env.CLOUDINARY_API_SECRET,

  // ANNOUNCE EMAIL TYPE
  INVITED_TO_PROJECT: "invited to project",
  KICKED_OUT_PROJECT: "kicked out project",
  TASK_NEAR_DEADLINE: "task near deadline",
  ASSIGNED_TO_TASK: "assigned to task",
  UPDATE_ASSIGNED_TASK: "update assigned task",
  ASSIGNED_TO_ANOTHER_PERSON: "assigned to another person",
  TASK_UNASSIGNED: "task unassigned",
  TASK_COMPLETE: "task complete",
  TASK_OVERDUE: "task uncomplete",

  //
  DUE_DAYS_LIMIT: 2,
  OVERDUE_DAYS_LIMIT: 2,
};
