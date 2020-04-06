"use strict";
const { DataTypes } = require("sequelize");
const db = require("../../../utils/DB");

const State = db.sequelize.define("States", {
  idState: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: { type: DataTypes.STRING }
});

module.exports = State;
