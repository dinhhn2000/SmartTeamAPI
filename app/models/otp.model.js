"use strict";
const { DataTypes } = require("sequelize");
const db = require("../utils/DB/db");

const Otp = db.sequelize.define(
  "OTP",
  {
    id_user: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    otp: { type: DataTypes.INTEGER, unique: true, primaryKey: true },
    email: { type: DataTypes.STRING },
    type: {
      type: DataTypes.INTEGER
      // 1: verify account
      // 2: reset password
      // 3: ...
    }
  },
  { timestamps: true, createdAt: "createdAt", updatedAt: false }
);

// Otp.sync().then(() => {
//   // console.log("Users table created");
// });

module.exports = Otp;
