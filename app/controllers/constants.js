require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET || "jwt_secret";
const expireTime = process.env.EXPIRE_TIME || 300;

module.exports = {
  JWT_SECRET,
  expireTime
};
