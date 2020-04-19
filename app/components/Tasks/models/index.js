"use strict";
const { DataTypes, Deferrable } = require("sequelize");
const withInterval = require("sequelize-interval-postgres");
const db = require("../../../utils/DB");
const helpers = require("../../../utils/Helpers");

const intervalDataTypes = withInterval(DataTypes);

const Task = db.sequelize.define("Tasks", {
  idTask: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  idProject: {
    allowNull: false,
    type: DataTypes.INTEGER,
    references: {
      model: "Projects",
      key: "idProject",
      deferrable: Deferrable.INITIALLY_DEFERRED,
    },
  },
  idUser: {
    allowNull: true,
    type: DataTypes.INTEGER,
    references: {
      model: "Users",
      key: "idUser",
      deferrable: Deferrable.INITIALLY_DEFERRED,
    },
  },
  idMilestone: {
    allowNull: false,
    type: DataTypes.INTEGER,
    references: {
      model: "Milestones",
      key: "idMilestone",
      deferrable: Deferrable.INITIALLY_DEFERRED,
    },
  },
  name: { allowNull: false, type: DataTypes.STRING },
  description: { type: DataTypes.STRING },
  startedAt: { allowNull: true, type: DataTypes.DATE },
  finishedAt: { allowNull: true, type: DataTypes.DATE },
  workedTime: { allowNull: true, type: intervalDataTypes.INTERVAL },
  remainTime: { allowNull: true, type: intervalDataTypes.INTERVAL },
  progress: { allowNull: false, type: DataTypes.FLOAT, defaultValue: 0 },
  points: { allowNull: false, type: DataTypes.FLOAT },
  type: {
    allowNull: false,
    type: DataTypes.INTEGER,
    references: {
      model: "TaskTypes",
      key: "idType",
      deferrable: Deferrable.INITIALLY_DEFERRED,
    },
  },
  state: {
    allowNull: false,
    type: DataTypes.INTEGER,
    references: {
      model: "States",
      key: "idState",
      deferrable: Deferrable.INITIALLY_DEFERRED,
    },
  },
  duration: {
    allowNull: false,
    type: intervalDataTypes.INTERVAL,
  },
});

module.exports = {
  Task,
  findByTime: async (idProject, from, to, query) => {
    const filter = {
      where: {
        idProject,
        finishedAt: { [Op.gte]: from },
        startedAt: { [Op.lte]: to },
      },
    };

    let paginationQuery = helpers.paginationQuery(filter, query);
    if (paginationQuery.hasPagination)
      return helpers.listStructure(
        paginationQuery.pageIndex,
        await Task.findAndCountAll(paginationQuery.query),
        "tasks"
      );
    else return Task.findAll(paginationQuery.query);
  },
  findByDueDayAndIdProject: async (idProject, from, to, query) => {
    const filter = {
      where: {
        idProject,
        finishedAt: { [Op.gte]: from },
        finishedAt: { [Op.lte]: to },
      },
    };

    let paginationQuery = helpers.paginationQuery(filter, query);
    if (paginationQuery.hasPagination)
      return helpers.listStructure(
        paginationQuery.pageIndex,
        await Task.findAndCountAll(paginationQuery.query),
        "tasks"
      );
    else return Task.findAll(paginationQuery.query);
  },
  findByIdProject: async (idProject, query) => {
    const filter = { where: { idProject } };

    let paginationQuery = helpers.paginationQuery(filter, query);
    if (paginationQuery.hasPagination)
      return helpers.listStructure(
        paginationQuery.pageIndex,
        await Task.findAndCountAll(paginationQuery.query),
        "tasks"
      );
    else return Task.findAll(paginationQuery.query);
  },
  findByIdMilestone: async (idMilestone, query) => {
    const filter = { where: { idMilestone } };

    let paginationQuery = helpers.paginationQuery(filter, query);
    if (paginationQuery.hasPagination)
      return helpers.listStructure(
        paginationQuery.pageIndex,
        await Task.findAndCountAll(paginationQuery.query),
        "tasks"
      );
    else return Task.findAll(paginationQuery.query);
  },
  findByIdMilestoneAndIdUser: async (idMilestone, idUser, query) => {
    const filter = { where: { idMilestone, idUser } };

    let paginationQuery = helpers.paginationQuery(filter, query);
    if (paginationQuery.hasPagination)
      return helpers.listStructure(
        paginationQuery.pageIndex,
        await Task.findAndCountAll(paginationQuery.query),
        "tasks"
      );
    else return Task.findAll(paginationQuery.query);
  },
};
