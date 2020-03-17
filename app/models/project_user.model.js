"use strict";
const { DataTypes, Deferrable } = require("sequelize");
const db = require("../utils/DB/db");

const Project_User = db.sequelize.define(
  "Project_User",
  {
    id_user: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: "Users",
        key: "id_user",
        deferrable: Deferrable.INITIALLY_DEFERRED
      }
    },
    id_project: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: "Projects",
        key: "id_project",
        deferrable: Deferrable.INITIALLY_DEFERRED
      }
    }
  },
  { freezeTableName: true }
);

Project_User.sync().then(async () => {});
module.exports = User_Role;
