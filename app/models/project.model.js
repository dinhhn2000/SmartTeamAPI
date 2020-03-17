"use strict";
const { DataTypes } = require("sequelize");
const db = require("../utils/DB/db");

const Project = db.sequelize.define("Projects", {
  id_project: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

Project.sync().then(async () => {
  // console.log("Roles table created");
});
module.exports = Project;
