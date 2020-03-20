"use strict";
const { DataTypes, Deferrable } = require("sequelize");
const db = require("../utils/DB");

const Project = db.sequelize.define(
  "Projects",
  {
    id_project: {
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
    creator: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Teams",
        key: "id_team",
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
        key: "id_state",
        deferrable: Deferrable.INITIALLY_DEFERRED
      }
    },
    priority: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: "Priorities",
        key: "id_priority",
        deferrable: Deferrable.INITIALLY_DEFERRED
      }
    },
    finishedAt: {
      allowNull: false,
      type: DataTypes.DATE
    }
  },
  { timestamps: true, createdAt: "createdAt", updatedAt: false }
);

// Project.sync().then(async () => {
//   // console.log("Roles table created");
// });
module.exports = Project;
