"use strict";
const { DataTypes, Deferrable } = require("sequelize");
const withInterval = require("sequelize-interval-postgres");
const db = require("../utils/DB");

const intervalDataTypes = withInterval(DataTypes);

const Task = db.sequelize.define("Tasks", {
  idTask: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  idProject: {
    allowNull: false,
    type: DataTypes.INTEGER,
    references: {
      model: "Projects",
      key: "idProject",
      deferrable: Deferrable.INITIALLY_DEFERRED
    }
  },
  name: {
    allowNull: false,
    type: DataTypes.STRING
  },
  description: {
    type: DataTypes.STRING
  },
  startedAt: {
    allowNull: true,
    type: DataTypes.DATE
  },
  finishedAt: {
    allowNull: true,
    type: DataTypes.DATE
  },
  points: {
    allowNull: false,
    type: DataTypes.INTEGER
  },
  type: {
    allowNull: false,
    type: DataTypes.INTEGER,
    references: {
      model: "Task_Types",
      key: "idType",
      deferrable: Deferrable.INITIALLY_DEFERRED
    }
  },
  duration: {
    allowNull: false,
    type: intervalDataTypes.INTERVAL
  }
});

module.exports = Task;
