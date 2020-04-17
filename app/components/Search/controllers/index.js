"use strict";
const response = require("../../../utils/Responses");
const models = require("../../../utils/Models");
const transactions = require("../transactions/project.transaction");
const helpers = require("../../../utils/Helpers");
const validators = require("../../../utils/Validations/validations");
const { Op } = require("sequelize");

module.exports = {
  searchProjectByTime: async (req, res, next) => {
    let { user } = req;
    let { startedAt, finishedAt } = req.query;
    try {
      validators.validateStartFinish(startedAt, finishedAt);
      validators.validatePagination(req.query);

      // Get all user's project
      let projectId = await models.ProjectUserModel.findAll({
        where: { idUser: user.idUser },
        raw: true,
      });
      if (projectId.length === 0)
        throw response.success(res, "This account is not in any project");
      projectId = projectId.map((id) => id.idProject);

      // Get all project in this period
      let projectRecords = await models.ProjectModelHelpers.findByTime(req.query);

      return response.success(res, "Search success", projectRecords);
    } catch (e) {
      return response.error(res, "Search failed", e);
    }
  },
  searchTaskByTime: async (req, res, next) => {
    let { user } = req;
    let { idProject, startedAt, finishedAt } = req.query;
    try {
      validators.validateId(idProject);
      validators.validateStartFinish(startedAt, finishedAt);
      validators.validatePagination(req.query);

      // Get all user's project
      let validMember = await models.ProjectUserModel.findOne({
        where: { idUser: user.idUser, idProject },
        raw: true,
      });
      if (!validMember)
        throw response.success(res, "This account is not in this project");

      // Get all task in this period
      let taskRecords = await models.TaskModelHelpers.findByTime(req.query);

      return response.success(res, "Search success", taskRecords);
    } catch (e) {
      return response.error(res, "Search failed", e);
    }
  },
  // searchMilestoneByTime: async (req, res, next) => {
  //   let { user } = req;
  //   let { idProject, startedAt, finishedAt, pageIndex, limit } = req.query;
  //   try {
  //     validators.validateId(idProject);
  //     validators.validateStartFinish(startedAt, finishedAt);
  //     validators.validatePagination(req.query);

  //     // Get all user's project
  //     let validMember = await models.ProjectUserModel.findOne({
  //       where: { idUser: user.idUser, idProject },
  //       raw: true,
  //     });
  //     if (!validMember)
  //       throw response.success(res, "This account is not in this project");

  //     // Get all task in this period
  //     let milestoneRecords = await models.MilestoneModel.findOrCountAll({
  //       where: {
  //         idProject: projectId,
  //         startedAt: { [Op.gte]: startedAt },
  //         finishedAt: { [Op.lte]: finishedAt },
  //       },
  //       offset: (pageIndex - 1) * limit,
  //       limit,
  //       raw: true,
  //     });

  //     return response.success(
  //       res,
  //       "Search success",
  //       helpers.listStructure(
  //         pageIndex,
  //         milestoneRecords.count,
  //         milestoneRecords.rows,
  //         "milestones"
  //       )
  //     );
  //   } catch (e) {
  //     return response.error(res, "Search failed", e);
  //   }
  // },
  // searchProjectByPriority: async (req, res, next) => {
  //   let { user } = req;
  //   let { priorityMin, priorityMax, pageIndex, limit } = req.query;
  //   try {
  //     validators.customValidate(priorityMin, "priorityMin", "priority");
  //     validators.customValidate(priorityMax, "priorityMax", "priority");
  //     if (priorityMin > priorityMax) throw "priorityMin cannot exceed priorityMax";

  //     // Get all user's project
  //     let projectId = await models.ProjectUserModel.findAll({
  //       where: { idUser: user.idUser },
  //       raw: true,
  //     });
  //     if (projectId.length === 0)
  //       throw response.success(res, "This account is not in any project");
  //     projectId = projectId.map((id) => id.idProject);

  //     // Get all project in this priority range
  //     let projectRecords = await models.ProjectModel.findOrCountAll({
  //       where: {
  //         idProject: { [Op.in]: projectId },
  //         priority: { [Op.between]: [priorityMin, priorityMax] },
  //       },
  //       offset: (pageIndex - 1) * limit,
  //       limit,
  //       raw: true,
  //     });

  //     return response.success(
  //       res,
  //       "Search success",
  //       helpers.listStructure(
  //         pageIndex,
  //         projectRecords.count,
  //         projectRecords.rows,
  //         "projects"
  //       )
  //     );
  //   } catch (e) {
  //     return response.error(res, "Search failed", e);
  //   }
  // },
};
