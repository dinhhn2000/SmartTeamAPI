"use strict";

const { DataTypes, Deferrable, Op } = require("sequelize");
const db = require("../../../utils/DB");
const helpers = require("../../../utils/Helpers");

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

module.exports = {
  Milestone,
  findByIdProject: async (idProject, query) => {
    let filter = { where: { idProject } };
    let paginationQuery = helpers.paginationQuery(filter, query);
    if (paginationQuery.hasPagination)
      return helpers.listStructure(
        paginationQuery.pageIndex,
        await Milestone.findAndCountAll(paginationQuery.query),
        "milestones"
      );
    else return Milestone.findAll(paginationQuery.query);
  },
};
