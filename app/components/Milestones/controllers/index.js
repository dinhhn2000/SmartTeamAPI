"use strict";
const response = require("../../../utils/Responses");
const models = require("../../../utils/Models");
const validators = require("../../../utils/Validations/validations");
const helpers = require("../../../utils/Helpers");

module.exports = {
  getMilestone: async (req, res, next) => {
    let { user } = req;
    let idMilestone = req.query.id;
    try {
      if (idMilestone === undefined || idMilestone === "")
        throw "Required id (idMilestone)";
      validators.validateId(idMilestone);

      let milestoneInfo = await models.MilestoneModel.findOne({
        where: { idMilestone },
        raw: true,
      });
      if (!milestoneInfo) throw "This milestone not exist";

      // Check is in project
      let isInProject = await models.ProjectUserModel.findOne({
        where: { idUser: user.idUser, idProject: milestoneInfo.idProject },
      });
      if (!isInProject) throw "This account is not in this project";

      return response.success(res, "Get milestone's info success", milestoneInfo);
    } catch (e) {
      return response.error(res, "Get milestone's info fail", e);
    }
  },
  getMilestoneList: async (req, res, next) => {
    let { user } = req;
    let idProject = req.query.id;
    try {
      if (idProject === undefined || idProject === "") throw "Required id (idProject)";

      // Check is in project
      let isInProject = await models.ProjectUserModel.findOne({
        where: { idUser: user.idUser, idProject },
      });
      if (!isInProject) throw "This project not exist";

      let milestoneList = await models.MilestoneModel.findAll({
        where: { idProject },
        raw: true,
      });
      return response.success(res, "Get list of milestones success", milestoneList);
    } catch (e) {
      return response.error(res, "Get list of milestones fail", e);
    }
  },
  createMilestone: async (req, res, next) => {
    let { user } = req;
    let { idProject } = req.body;
    // let { name, idProject, startedAt, finishedAt } = req.body;
    try {
      validators.validateMilestoneInfo(req.body);

      // Check idProject
      let project = await models.ProjectModel.findOne({ where: { idProject } });
      if (!project) throw "This project is not existed";

      // Check admin
      let isAdmin = await models.ProjectUserModel.findOne({
        where: { idUser: user.idUser, idRole: 2, idProject },
      });
      if (!isAdmin) throw "This account is not the admin in this project";

      // Check milestone date
      if (!helpers.isBeforeOrEqualThan(project.startedAt, req.body.startedAt))
        throw "startedAt cannot before project's startedAt";
      if (!helpers.isBeforeOrEqualThan(req.body.finishedAt, project.finishedAt))
        throw "finishedAt cannot after project's finishedAt";

      // Create milestone
      const newMilestone = await models.MilestoneModel.create(req.body);
      return response.created(res, "Create milestone success", newMilestone);
    } catch (e) {
      return response.error(res, "Create milestone fail", e);
    }
  },
  updateMilestone: async (req, res, next) => {
    let { user } = req;
    let { idMilestone } = req.body;
    // let { name, idMilestone, startedAt, finishedAt } = req.body;
    try {
      validators.validateUpdateMilestoneInfo(req.body);

      // Check milestone
      let milestoneRecord = await models.MilestoneModel.findOne({
        where: { idMilestone },
        raw: true,
      });
      if (!milestoneRecord) throw "This milestone is not existed";

      // Check admin
      let isAdmin = await models.ProjectUserModel.findOne({
        where: { idUser: user.idUser, idRole: 2, idProject: milestoneRecord.idProject },
      });
      if (!isAdmin) throw "This account is not the admin in this project";

      // Update milestone
      await models.MilestoneModel.update(req.body, {
        where: { idMilestone },
        raw: true,
      });
      return response.accepted(res, "Update milestone success");
    } catch (e) {
      return response.error(res, "Update milestone fail", e);
    }
  },
  removeMilestone: async (req, res, next) => {
    const { user } = req;
    const { idMilestone } = req.body;
    try {
      if (idMilestone === undefined || idMilestone === "") throw "Required idMilestone";

      // Check milestone
      let milestoneRecord = await models.MilestoneModel.findOne({
        where: { idMilestone },
        raw: true,
      });
      if (!milestoneRecord) throw "Milestone not exist";

      // Check admin
      let isAdmin = await models.ProjectUserModel.findOne({
        where: { idUser: user.idUser, idRole: 2, idProject: milestoneRecord.idProject },
      });
      if (!isAdmin) throw "This account is not the admin in this project";

      // Check if any task was created in this milestone
      let isValid = await models.TaskModel.findOne({ where: { idMilestone } });
      if (!!isValid) throw "This milestone already been used";

      await models.MilestoneModel.destroy({ where: { idMilestone } });
      return response.success(res, "Remove milestone success");
    } catch (e) {
      return response.error(res, "Remove milestone fail", e);
    }
  },
};
