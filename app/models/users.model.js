"use strict";
const { DataTypes } = require("sequelize");
const db = require("../utils/DB");

const User = db.sequelize.define("Users", {
  idUser: {
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.INTEGER,
    allowNull: false
  },
  firstName: { type: DataTypes.STRING, allowNull: false },
  lastName: { type: DataTypes.STRING, allowNull: false },
  avatar: { type: DataTypes.STRING, allowNull: true },
  dob: { type: DataTypes.DATE, allowNull: true },
  gender: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "Male",
    validate: {
      isIn: {
        args: [["Male", "Female", "Not identify"]],
        msg: "Must be Male or Female or Not identify"
      }
    }
  },
  email: { type: DataTypes.STRING, allowNull: true, unique: true },
  password: { type: DataTypes.STRING, allowNull: true },
  googleId: { type: DataTypes.STRING, allowNull: true },
  facebookId: { type: DataTypes.STRING, allowNull: true },
  is_verified: { type: DataTypes.BOOLEAN, defaultValue: false }
});

module.exports = User;
