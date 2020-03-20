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
  cloudinarySecret: process.env.CLOUDINARY_API_SECRET
};
