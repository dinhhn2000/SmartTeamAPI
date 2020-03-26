"use strict";
const { DataTypes } = require("sequelize");
const db = require("../utils/DB");

const Otp = db.sequelize.define("OTP", {
  idUser: {
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
});

module.exports = Otp;
