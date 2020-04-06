"use strict";
const response = require("../../../utils/Responses");
const models = require("../../../utils/Models");
const transactions = require("../transactions/task.transaction");
const validators = require("../../../utils/Validations/validations");
const helpers = require("../../../utils/Helpers");

module.exports = {
  getTask: async (req, res, next) => {
    let { user } = req;
    let idTask = req.query.idTask;
    try {
      if (idTask === undefined || idTask === "") throw "Required idProject";
      validators.validateId(idTask);

      let taskInfo = await models.TaskModel.findOne({ where: { idTask }, raw: true });
      if (!taskInfo) throw "This task not exist";

      // Check is in project
      let isInProject = await models.ProjectUserModel.findOne({
        where: { idUser: user.idUser, idProject: taskInfo.idProject }
      });
      if (!isInProject) throw "This account is not in this project";

      return response.success(res, "Get list of tasks success", taskInfo);
    } catch (e) {
      return response.error(res, "Get list of tasks fail", e);
    }
  },
  getTaskList: async (req, res, next) => {
    let { user } = req;
    let { idProject } = req.body;
    try {
      if (idProject === undefined || idProject === "") throw "Required idProject";

      // Check is in project
      let isInProject = await models.ProjectUserModel.findOne({
        where: { idUser: user.idUser, idProject }
      });
      if (!isInProject) throw "This project not exist";

      let taskList = await models.TaskModel.findAll({ where: { idProject }, raw: true });
      return response.success(res, "Get list of tasks success", taskList);
    } catch (e) {
      return response.error(res, "Get list of tasks fail", e);
    }
  },
  getTaskMember: async (req, res, next) => {
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

      // Get list member's info
      let memberInfo = await models.UserModel.findOne({
        attributes: {
          exclude: models.excludeFieldsForUserInfo
        },
        where: { idUser: taskRecord.idUser },
        raw: true
      });
      return response.success(res, "Get list of member success", memberInfo);
    } catch (e) {
      return response.error(res, "Get list of tasks fail", e);
    }
  },
  createTask: async (req, res, next) => {
    let { user } = req;
    let { idProject, member } = req.body;
    // let { name, description, points, idProject, startedAt, finishedAt, type, duration } = req.body;
    try {
      validators.validateTaskInfo(req.body);

      // Check idProject
      let project = await models.ProjectModel.findOne({ where: { idProject } });
      if (!project) throw "This project is not existed";

      // Check admin
      let isAdmin = await models.ProjectUserModel.findOne({
        where: { idUser: user.idUser, idRole: 2, idProject }
      });
      if (!isAdmin) throw "This account is not the admin in this project";

      // Check member
      if (member !== undefined) {
        let isUser = await models.UserModel.findOne({ where: { idUser: member } });
        if (!isUser) throw "This member not exist";

        let isMember = await models.ProjectUserModel.findOne({
          where: { idUser: member, idProject }
        });
        if (!isMember) throw "This member is not in this team";
        else req.body.idUser = member;
      }

      // Convert points to 0.25 format
      req.body.points = helpers.roundPoints(req.body.points);

      // Create task
      const newTask = await transactions.createTask(req.body);
      return response.created(res, "Create task success", newTask);
    } catch (e) {
      console.log(e);
      return response.error(res, "Create task fail", e);
    }
  },
  updateTask: async (req, res, next) => {
    let { user } = req;
    let { idTask } = req.body;
    // let { idTask, name, description, points, finishedAt, type, duration } = req.body;
    try {
      validators.validateUpdateTaskInfo(req.body);

      // Check task
      let taskRecord = await models.TaskModel.findOne({ where: { idTask }, raw: true });
      if (!taskRecord) throw "This task is not existed";

      // Check admin
      let isAdmin = await models.ProjectUserModel.findOne({
        where: { idUser: user.idUser, idRole: 2, idProject: taskRecord.idProject }
      });
      if (!isAdmin) throw "This account is not the admin in this project";

      // Convert points to 0.25 format
      if (req.body.points !== undefined)
        req.body.points = helpers.roundPoints(req.body.points);

      await models.TaskModel.update(req.body, {
        where: { idTask },
        raw: true
      });
      return response.accepted(res, "Update task success");
    } catch (e) {
      return response.error(res, "Update task fail", e);
    }
  },
  updateProgressTask: async (req, res, next) => {
    let { user } = req;
    let { idTask, workedTime, remainTime } = req.body;
    try {
      // if (!user) throw "User not found";
      validators.validateUpdateTaskProgress(req.body);

      // Check task
      let taskRecord = await models.TaskModel.findOne({ where: { idTask }, raw: true });
      if (!taskRecord) throw "This task is not existed";

      // Check member
      if (user.idUser !== taskRecord.idUser)
        throw "This account is not assigned for this task";

      // Convert hh:mm to minutes
      let worked = workedTime.split(":"); // split it at the colons
      let remain = remainTime.split(":"); // split it at the colons
      var workedMinutes = +worked[0] * 60 + +worked[1];
      var remainMinutes = +remain[0] * 60 + +remain[1];

      // Calculate the progress
      let progress = (workedMinutes / (workedMinutes + remainMinutes)) * 100;

      await models.TaskModel.update(
        { workedTime, remainTime, progress },
        { where: { idTask }, raw: true }
      );
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
  addMember: async (req, res, next) => {
    let { user } = req;
    let { idTask, member } = req.body;
    try {
      validators.validateTaskMembers(idTask, member);
      await transactions.addMember(idTask, member, user.idUser);
      return response.created(res, "Add task's member success");
    } catch (e) {
      return response.error(res, "Add task's member success", e);
    }
  },
  updateMember: async (req, res, next) => {
    let { user } = req;
    let { idTask, member } = req.body;
    try {
      validators.validateTaskMembers(idTask, member);
      await transactions.updateMember(idTask, member, user.idUser);
      return response.created(res, "Add task's member success");
    } catch (e) {
      return response.error(res, "Add task's member success", e);
    }
  },
  removeMember: async (req, res, next) => {
    let { user } = req;
    let { idTask, member } = req.body;
    try {
      validators.validateTaskMembers(idTask, member);
      await transactions.removeMember(idTask, member, user.idUser);
      return response.accepted(res, "Remove task's member success");
    } catch (e) {
      return response.error(res, "Add task's member success", e);
    }
  },
  startTask: async (req, res, next) => {
    let { user } = req;
    let { idTask } = req.body;
    try {
      // if (!user) throw "User not found";
      if (idTask === undefined || idTask === "") throw "Required idTask";

      // Check task
      let taskRecord = await models.TaskModel.findOne({ where: { idTask }, raw: true });
      if (!taskRecord) throw "This task is not existed";

      // Check member
      if (user.idUser !== taskRecord.idUser)
        throw "This account is not assigned for this task";

      await models.TaskModel.update(
        { workedTime: "0", remainTime: "0", progress: 0 },
        { where: { idTask }, raw: true }
      );
      return response.accepted(res, "Start working task success");
    } catch (e) {
      return response.error(res, "Start working task fail", e);
    }
  },
  endTask: async (req, res, next) => {
    let { user } = req;
    let { idTask, workedTime } = req.body;
    try {
      // if (!user) throw "User not found";
      if (idTask === undefined || idTask === "") throw "Required idTask";
      validators.validateInterval(workedTime);

      // Check task
      let taskRecord = await models.TaskModel.findOne({ where: { idTask }, raw: true });
      if (!taskRecord) throw "This task is not existed";

      // Check member
      if (user.idUser !== taskRecord.idUser)
        throw "This account is not assigned for this task";

      await models.TaskModel.update(
        { workedTime, remainTime: "0", progress: 100 },
        { where: { idTask }, raw: true }
      );
      return response.accepted(res, "End task success");
    } catch (e) {
      return response.error(res, "End task fail", e);
    }
  }
};
