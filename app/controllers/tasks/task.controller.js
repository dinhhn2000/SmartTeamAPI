"use strict";
const response = require("../../utils/Responses");
const models = require("../../models");
const transactions = require("./task.transaction");
const helpers = require("../../utils/Helpers");
const validators = require("../../utils/Validations/validations");
const { Op } = require("sequelize");

module.exports = {
  getTaskList: async (req, res, next) => {
    let { user } = req;
    let { idProject } = req.body;
    try {
      if (idProject === undefined || idProject === "") throw "Required idProject";

      // Check is in project
      let isInProject = await models.ProjectUserModel.findOne({
        where: { idUser: user.idUser, idProject }
      });
      if (!isInProject) throw "This account is not in this project";

      let taskList = await models.TaskModel.findAll({ where: { idProject }, raw: true });
      return response.success(res, "Get list of tasks success", taskList);
    } catch (e) {
      return response.error(res, "Get list of tasks fail", e);
    }
  },
  getTaskMemberList: async (req, res, next) => {
    let { user } = req;
    let { idTask } = req.body;
    try {
      if (idTask === undefined || idTask === "") throw "Required idTask";

      // Check task
      let taskRecord = await models.TaskModel.findOne({ where: { idTask } });
      if (!taskRecord) throw "This task is not exist";

      // Check is in the project
      let isInProject = await models.ProjectUserModel.findOne({
        where: { idUser: user.idUser, idProject: taskRecord.idProject }
      });
      if (!isInProject) throw "This account is not in this project";

      // Get list members' info
      let membersId = await models.TaskUserModel.findAll({
        attributes: ["idUser"],
        where: { idTask },
        raw: true
      });
      membersId = membersId.map(e => e.idUser);

      let membersInfo = await models.UserModel.findAll({
        attributes: {
          exclude: models.excludeFieldsForUserInfo
        },
        where: { idUser: { [Op.in]: membersId } },
        raw: true
      });
      return response.success(res, "Get list of members success", membersInfo);
    } catch (e) {
      return response.error(res, "Get list of tasks fail", e);
    }
  },
  createTask: async (req, res, next) => {
    let { user } = req;
    let { idProject, startedAt, finishedAt } = req.body;
    // let { name, description, points, idProject, startedAt, finishedAt, type, duration } = req.body;
    try {
      // if (!user) throw "User not found";
      validators.validateTaskInfo(req.body);
      if (startedAt !== undefined) {
        startedAt = helpers.convertDateToDATE(startedAt, "startedAt");
        validators.isInFuture(startedAt, "startedAt");
        req.body.startedAt = startedAt;
      }
      if (finishedAt !== undefined) {
        finishedAt = helpers.convertDateToDATE(finishedAt, "finishedAt");
        validators.isInFuture(finishedAt, "finishedAt");
        req.body.finishedAt = finishedAt;
      }

      // Check idProject
      let project = models.ProjectModel.findOne({ where: { idProject } });
      if (!project) throw "This project is not existed";

      // Check admin
      let isAdmin = await models.ProjectUserModel.findOne({
        where: { idUser: user.idUser, idRole: 2, idProject }
      });
      if (!isAdmin) throw "This account is not the admin in this project";

      // Create task
      const newTask = await transactions.createTask(req.body);
      return response.created(res, "Create task success", newTask);
    } catch (e) {
      return response.error(res, "Create task fail", e);
    }
  },
  updateTask: async (req, res, next) => {
    let { user } = req;
    let { idTask, startedAt, finishedAt } = req.body;
    // let { idTask, name, description, points, finishedAt, type, duration } = req.body;
    try {
      // if (!user) throw "User not found";
      validators.validateUpdateTaskInfo(req.body);
      if (startedAt !== undefined) {
        startedAt = helpers.convertDateToDATE(startedAt, "startedAt");
        validators.isInFuture(startedAt, "startedAt");
        req.body.startedAt = startedAt;
      }
      if (finishedAt !== undefined) {
        finishedAt = helpers.convertDateToDATE(finishedAt, "finishedAt");
        validators.isInFuture(finishedAt, "finishedAt");
        req.body.finishedAt = finishedAt;
      }

      // Check task
      let taskRecord = await models.TaskModel.findOne({ where: { idTask }, raw: true });
      if (!taskRecord) throw "This task is not existed";

      // Check admin
      let isAdmin = await models.ProjectUserModel.findOne({
        where: { idUser: user.idUser, idRole: 2, idProject: taskRecord.idProject }
      });
      if (!isAdmin) throw "This account is not the admin in this project";

      await models.TaskModel.update(req.body, {
        where: { idTask },
        raw: true
      });
      return response.accepted(res, "Update task success");
    } catch (e) {
      return response.error(res, "Update task fail", e);
    }
  },
  removeTask: async (req, res, next) => {
    const { user } = req;
    const { idTask } = req.body;
    try {
      if (idTask === undefined || idTask === "") throw "Required idTask";
      await transactions.removeTask(idTask, user.idUser);
      return response.success(res, "Remove task success");
    } catch (e) {
      return response.error(res, "Remove task fail", e);
    }
  },
  addMembers: async (req, res, next) => {
    let { user } = req;
    let { idTask, members } = req.body;
    try {
      validators.validateTaskMembers(idTask, members);
      await transactions.addMembers(idTask, members, user.idUser);
      return response.created(res, "Add task's member success");
    } catch (e) {
      return response.error(res, "Add task's member success", e);
    }
  },
  removeMembers: async (req, res, next) => {
    let { user } = req;
    let { idTask, members } = req.body;
    try {
      validators.validateTaskMembers(idTask, members);
      await transactions.removeMembers(idTask, members, user.idUser);
      return response.accepted(res, "Remove task's member success");
    } catch (e) {
      return response.error(res, "Add task's member success", e);
    }
  }
};
