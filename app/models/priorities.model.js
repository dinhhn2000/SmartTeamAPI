"use strict";
const { DataTypes } = require("sequelize");
const db = require("../utils/DB");

const Priority = db.sequelize.define("Priorities", {
  idPriority: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: { type: DataTypes.STRING }
});

module.exports = Priority;
