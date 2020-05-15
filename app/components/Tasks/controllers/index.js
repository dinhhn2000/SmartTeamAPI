"use strict";
const response = require("../../../utils/Responses");
const models = require("../../../utils/Models");
const transactions = require("../transactions/task.transaction");
const validators = require("../../../utils/Validations/validations");
const helpers = require("../../../utils/Helpers");
const constants = require("../../../utils/Constants");
const { sendEmail, createAnnounceEmail } = require("../../../utils/Email");
const { Op } = require("sequelize");

module.exports = {
  getTask: async (req, res, next) => {
    let { user } = req;
    let idTask = req.query.id;
    try {
      if (idTask === undefined || idTask === "") throw "Required id (idTask)";
      validators.validateId(idTask);

      let taskInfo = await models.TaskModel.findOne({ where: { idTask }, raw: true });
      if (!taskInfo) throw "This task not exist";

      // Check is in project
      let isInProject = await models.ProjectUserModel.findOne({
        where: { idUser: user.idUser, idProject: taskInfo.idProject },
      });
      if (!isInProject) throw "This account is not in this project";

      return response.success(res, "Get list of tasks success", taskInfo);
    } catch (e) {
      return response.error(res, "Get list of tasks fail", e);
    }
  },
  getTaskList: async (req, res, next) => {
    let { user } = req;
    let idProject = req.query.id;
    try {
      if (idProject === undefined || idProject === "") throw "Required id (idProject)";
      validators.validatePagination(req.query);

      // Check is in project
      let isInProject = await models.ProjectUserModel.findOne({
        where: { idUser: user.idUser, idProject },
      });
      if (!isInProject) throw "This project not exist";

      let taskList = await models.TaskModel.findByIdProject(idProject, req.query);

      return response.success(res, "Get list of tasks success", taskList);
    } catch (e) {
      return response.error(res, "Get list of tasks fail", e);
    }
  },
  getTaskMember: async (req, res, next) => {
    let { user } = req;
    let idTask = req.query.id;
    try {
      if (idTask === undefined || idTask === "") throw "Required id (idTask)";

      // Check task
      let taskRecord = await models.TaskModel.findOne({ where: { idTask } });
      if (!taskRecord) throw "This task is not exist";

      // Check is in the project
      let isInProject = await models.ProjectUserModel.findOne({
        where: { idUser: user.idUser, idProject: taskRecord.idProject },
      });
      if (!isInProject) throw "This account is not in this project";

      // Get list member's info
      let memberInfo = await models.UserModel.findOne({
        attributes: {
          exclude: models.excludeFieldsForUserInfo,
        },
        where: { idUser: taskRecord.idUser },
        raw: true,
      });
      return response.success(res, "Get list of member success", memberInfo);
    } catch (e) {
      return response.error(res, "Get list of tasks fail", e);
    }
  },
  createTask: async (req, res, next) => {
    let { user } = req;
    let { idProject, member, idMilestone, startedAt, finishedAt } = req.body;
    // let { name, description, points, idProject, startedAt, finishedAt, type, duration, idMilestone } = req.body;
    try {
      validators.validateTaskInfo(req.body);

      // Check idProject
      let project = await models.ProjectModel.findOne({ where: { idProject } });
      if (!project) throw "This project is not existed";

      // Check admin
      let isAdmin = await models.ProjectUserModel.findOne({
        where: { idUser: user.idUser, idRole: 2, idProject },
      });
      if (!isAdmin) throw "This account is not the admin in this project";

      // Check member
      if (member !== undefined) {
        let isUser = await models.UserModel.findOne({ where: { idUser: member } });
        if (!isUser) throw "This member not exist";

        let isMember = await models.ProjectUserModel.findOne({
          where: { idUser: member, idProject },
        });
        if (!isMember) throw "This member is not in this project";
        else req.body.idUser = member;
      }

      // Convert points to 0.25 format
      req.body.points = helpers.roundPoints(req.body.points);

      // Check milestone
      if (finishedAt !== undefined && startedAt !== undefined) {
        let milestoneRecord = await models.MilestoneModel.findOne({
          where: { idMilestone },
          raw: true,
        });
        if (!milestoneRecord) throw "This milestone not exist";
        if (milestoneRecord.idProject != idProject)
          throw "This milestone not belongs to this project";
        if (!helpers.isBeforeOrEqualThan(milestoneRecord.startedAt, startedAt))
          throw "startedAt of this task is not in the milestone's time";
        if (!helpers.isBeforeOrEqualThan(finishedAt, milestoneRecord.finishedAt))
          throw "finishedAt of this task is not in the milestone's time";
      }

      // Create task
      const newTask = await transactions.createTask(req.body);
      return response.created(res, "Create task success", newTask);
    } catch (e) {
      return response.error(res, "Create task fail", e);
    }
  },
  updateTask: async (req, res, next) => {
    let { user } = req;
    let { idTask, idMilestone, startedAt, finishedAt } = req.body;
    // let { idTask, name, description, points, startedAt, finishedAt, type, duration, idMilestone  } = req.body;
    try {
      validators.validateUpdateTaskInfo(req.body);
      // Remove workedTime & remainTime in req.body if exist
      req.body.workedTime = undefined;
      req.body.remainTime = undefined;

      // Check task
      let taskRecord = await models.TaskModel.findOne({ where: { idTask }, raw: true });
      if (!taskRecord) throw "This task is not existed";

      // Check admin
      let isAdmin = await models.ProjectUserModel.findOne({
        where: { idUser: user.idUser, idRole: 2, idProject: taskRecord.idProject },
      });
      if (!isAdmin) throw "This account is not the admin in this project";

      // Convert points to 0.25 format
      if (req.body.points !== undefined) req.body.points = helpers.roundPoints(req.body.points);

      // Check milestone
      let isMilestoneValid = false;
      if (idMilestone !== undefined) {
        isMilestoneValid = await models.MilestoneModel.findOne({
          where: { idMilestone },
          raw: true,
        });
        if (!isMilestoneValid) throw "This milestone not exist";
        if (isMilestoneValid.idProject !== idProject)
          throw "This milestone not belongs to this project";
      }

      // Check start and finish
      if (finishedAt !== undefined || startedAt !== undefined) {
        let milestoneRecord;
        if (!!isMilestoneValid) milestoneRecord = isMilestoneValid;
        else
          milestoneRecord = await models.MilestoneModel.findOne({
            where: { idMilestone: taskRecord.idMilestone },
            raw: true,
          });
        if (startedAt !== undefined)
          if (!helpers.isBeforeOrEqualThan(milestoneRecord.startedAt, startedAt))
            throw "startedAt of this task is not in the milestone's time";

        if (finishedAt !== undefined)
          if (!helpers.isBeforeOrEqualThan(finishedAt, milestoneRecord.finishedAt))
            throw "finishedAt of this task is not in the milestone's time";

        if (startedAt !== undefined && finishedAt === undefined)
          if (!helpers.isBeforeOrEqualThan(startedAt, taskRecord.finishedAt))
            throw "startedAt cannot be after finishedAt";

        if (startedAt === undefined && finishedAt !== undefined)
          if (!helpers.isBeforeOrEqualThan(taskRecord.startedAt, finishedAt))
            throw "finishedAt cannot be after startedAt";
      }

      await models.TaskModel.update(req.body, { where: { idTask }, raw: true });

      // Send email to assigned member
      if (taskRecord.idUser !== null) {
        let memberInfo = await models.UserModel.findOne({
          where: { idUser: taskRecord.idUser, email: { [Op.not]: null } },
          raw: true,
        });
        if (!!memberInfo) {
          let sendData = { taskName: taskRecord.name };
          await sendEmail(
            createAnnounceEmail(memberInfo.email, constants.UPDATE_ASSIGNED_TASK, sendData)
          );
        }
      }

      return response.accepted(res, "Update task success");
    } catch (e) {
      return response.error(res, "Update task fail", e);
    }
  },
  updateProgressTask: async (req, res, next) => {
    let { user } = req;
    let { idTask, workedTime, remainTime } = req.body;
    try {
      validators.validateUpdateTaskProgress(req.body);

      // Check task
      let taskRecord = await models.TaskModel.findOne({ where: { idTask }, raw: true });
      if (!taskRecord) throw "This task is not existed";

      // Check member
      if (user.idUser !== taskRecord.idUser) throw "This account is not assigned for this task";

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
      if (idTask === undefined || idTask === "") throw "Required idTask";

      // Check task
      let taskRecord = await models.TaskModel.findOne({ where: { idTask }, raw: true });
      if (!taskRecord) throw "This task is not existed";

      // Check member
      if (user.idUser !== taskRecord.idUser) throw "This account is not assigned for this task";

      await models.TaskModel.update(
        { workedTime: "00:00", remainTime: taskRecord.duration, progress: 0, state: 3 },
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
      if (idTask === undefined || idTask === "") throw "Required idTask";
      validators.validateInterval(workedTime);

      // Check task
      let taskRecord = await models.TaskModel.findOne({ where: { idTask }, raw: true });
      if (!taskRecord) throw "This task is not existed";

      // Check member
      if (user.idUser !== taskRecord.idUser) throw "This account is not assigned for this task";

      await models.TaskModel.update(
        { workedTime, remainTime: "00:00", progress: 100, state: 7 },
        { where: { idTask }, raw: true }
      );

      // Send to all admin of project
      let adminIdList = await models.ProjectUserModel.findAll({
        attributes: ["idUser"],
        where: { idProject: taskRecord.idProject, idRole: 2 },
        raw: true,
      });
      adminIdList = adminIdList.map((e) => e.idUser);

      let adminEmailList = await models.UserModel.findAll({
        attributes: ["email"],
        where: { idUser: { [Op.in]: adminIdList }, email: { [Op.not]: null } },
      });
      adminEmailList = adminEmailList.map((e) => e.email);

      let taskName = taskRecord.name;
      await sendEmail(createAnnounceEmail(adminEmailList, constants.TASK_COMPLETE, { taskName }));

      return response.accepted(res, "End task success");
    } catch (e) {
      return response.error(res, "End task fail", e);
    }
  },
};
