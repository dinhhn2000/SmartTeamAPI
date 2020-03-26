"use strict";
const { DataTypes, Deferrable } = require("sequelize");
const db = require("../utils/DB");

const Project_User = db.sequelize.define(
  "Project_User",
  {
    idUser: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: "Users",
        key: "idUser",
        deferrable: Deferrable.INITIALLY_DEFERRED
      }
    },
    idProject: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: "Projects",
        key: "idProject",
        deferrable: Deferrable.INITIALLY_DEFERRED
      }
    },
    idRole: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Roles",
        key: "idRole",
        deferrable: Deferrable.INITIALLY_DEFERRED
      }
    }
  },
  { freezeTableName: true }
);

module.exports = Project_User;
