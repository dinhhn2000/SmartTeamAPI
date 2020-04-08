"use strict";

const { DataTypes, Deferrable } = require("sequelize");
const db = require("../../../utils/DB");

const Milestone = db.sequelize.define("Milestones", {
  idMilestone: {
    allowNull: false,
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: { allowNull: false, type: DataTypes.STRING },
  idProject: {
    allowNull: false,
    type: DataTypes.INTEGER,
    references: {
      model: "Projects",
      key: "idProject",
      deferrable: Deferrable.INITIALLY_DEFERRED,
    },
  },
  startedAt: { allowNull: false, type: DataTypes.DATE },
  finishedAt: { allowNull: false, type: DataTypes.DATE },
});

module.exports = Milestone;
