"use strict";
const { DataTypes, Deferrable } = require("sequelize");
const db = require("../utils/DB");

const Project = db.sequelize.define(
  "Projects",
  {
    idProject: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    short_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    idTeam: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Teams",
        key: "idTeam",
        deferrable: Deferrable.INITIALLY_DEFERRED
      }
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true
    },
    state: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "States",
        key: "idState",
        deferrable: Deferrable.INITIALLY_DEFERRED
      }
    },
    priority: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: "Priorities",
        key: "idPriority",
        deferrable: Deferrable.INITIALLY_DEFERRED
      }
    },
    finishedAt: {
      allowNull: false,
      type: DataTypes.DATE
    }
  },
  { indexes: [{ unique: true, fields: ["name", "idTeam"] }] }
);

module.exports = Project;
