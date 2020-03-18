"use strict";
require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET || "jwt_secret";
const expireTime = process.env.EXPIRE_TIME || 300;
const facebookClientId = process.env.FACEBOOK_CLIENT_ID;
const facebookClientSecret = process.env.FACEBOOK_CLIENT_SECRET;
const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

module.exports = {
  JWT_SECRET,
  expireTime,
  facebookClientId,
  facebookClientSecret,
  googleClientId,
  googleClientSecret
};
