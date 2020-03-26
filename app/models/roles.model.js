"use strict";
const { DataTypes } = require("sequelize");
const db = require("../utils/DB");

const Role = db.sequelize.define("Roles", {
  idRole: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: { type: DataTypes.STRING }
});

module.exports = Role;
