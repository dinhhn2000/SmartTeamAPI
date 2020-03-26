"use strict";
const { DataTypes, Deferrable } = require("sequelize");
const db = require("../utils/DB");

const TaskUser = db.sequelize.define(
  "Task_User",
  {
    idTask: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.INTEGER,
      references: {
        model: "Tasks",
        key: "idTask",
        deferrable: Deferrable.INITIALLY_DEFERRED
      }
    },
    idUser: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.INTEGER,
      references: {
        model: "Users",
        key: "idUser",
        deferrable: Deferrable.INITIALLY_DEFERRED
      }
    }
  },
  { freezeTableName: true }
);

module.exports = TaskUser;
