"use strict";
const { DataTypes } = require("sequelize");
const db = require("../../../utils/DB");

const TaskType = db.sequelize.define("TaskTypes", {
  idType: {
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.INTEGER
  },
  name: {
    type: DataTypes.STRING
  }
});

module.exports = TaskType;
