"use strict";
const { DataTypes, Deferrable, Op } = require("sequelize");
const db = require("../../../utils/DB");
const helpers = require("../../../utils/Helpers");

const Project = db.sequelize.define(
  "Projects",
  {
    idProject: {
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    short_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    idTeam: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Teams",
        key: "idTeam",
        deferrable: Deferrable.INITIALLY_DEFERRED,
      },
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    state: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "States",
        key: "idState",
        deferrable: Deferrable.INITIALLY_DEFERRED,
      },
    },
    priority: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: "Priorities",
        key: "idPriority",
        deferrable: Deferrable.INITIALLY_DEFERRED,
      },
    },
    startedAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    finishedAt: {
      allowNull: true,
      type: DataTypes.DATE,
    },
  },
  { indexes: [{ unique: true, fields: ["name", "idTeam"] }] }
);

module.exports = {
  Project,
  findByTimeAndIdProjectList: async (idList, from, to, query) => {
    const filter = {
      where: {
        idProject: { [Op.in]: idList },
        finishedAt: { [Op.gte]: from },
        startedAt: { [Op.lte]: to },
        ...query,
      },
    };

    let paginationQuery = helpers.paginationQuery(filter, query);
    if (paginationQuery.hasPagination)
      return helpers.listStructure(
        paginationQuery.pageIndex,
        await Project.findAndCountAll(paginationQuery.query),
        "projects"
      );
    else return Project.findAll(paginationQuery.query);
  },
  findByDueDayAndIdProjectList: async (idList, from, to, query) => {
    const filter = {
      where: {
        idProject: { [Op.in]: idList },
        finishedAt: { [Op.gte]: from },
        finishedAt: { [Op.lte]: to },
        ...query,
      },
    };

    let paginationQuery = helpers.paginationQuery(filter, query);
    if (paginationQuery.hasPagination)
      return helpers.listStructure(
        paginationQuery.pageIndex,
        await Project.findAndCountAll(paginationQuery.query),
        "projects"
      );
    else return Project.findAll(paginationQuery.query);
  },
  findByPriorityAndIdProjectList: async (idList, min, max, query) => {
    const filter = {
      where: {
        idProject: { [Op.in]: idList },
        priority: { [Op.between]: [min, max] },
        ...query,
      },
    };

    let paginationQuery = helpers.paginationQuery(filter, query);
    if (paginationQuery.hasPagination)
      return helpers.listStructure(
        paginationQuery.pageIndex,
        await Project.findAndCountAll(paginationQuery.query),
        "projects"
      );
    else return Project.findAll(paginationQuery.query);
  },
  findByIdProjectList: async (idList, query) => {
    const filter = { where: { idProject: { [Op.in]: idList }, ...query } };

    let paginationQuery = helpers.paginationQuery(filter, query);
    if (paginationQuery.hasPagination)
      return helpers.listStructure(
        paginationQuery.pageIndex,
        await Project.findAndCountAll(paginationQuery.query),
        "projects"
      );
    else return Project.findAll(paginationQuery.query);
  },
};
