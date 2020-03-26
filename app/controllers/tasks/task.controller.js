"use strict";
const response = require("../../utils/Responses");
const models = require("../../models");
const transactions = require("./task.transaction");
const helpers = require("../../utils/Helpers");
const validator = require("../../utils/Validations/validations");
const { Op } = require("sequelize");

module.exports = {
  getTaskList: async (req, res, next) => {
    try {
      let { user } = req;
      let taskUserRecords = await models.TaskUserModel.findAll({
        where: { idUser: user.idUser },
        raw: true
      });
      if (taskUserRecords.length === 0) throw "This task is not exist";
      let taskListIndex = taskUserRecords.map(record => {
        return record.idTask;
      });
      let taskList = [];
      for (let i = 0; i < taskListIndex.length; i++) {
        let team = await models.TaskModel.findOne({
          where: { idTask: taskListIndex[i] },
          raw: true
        });
        taskList.push(team);
      }
      return response.success(res, "Get list of tasks success", taskList);
    } catch (e) {
      console.log(e);
      return response.error(res, "Get list of tasks fail", e);
    }
  },
  getTaskMemberList: async (req, res, next) => {
    try {
      let { user } = req;
      let { idTask } = req.body;
      let taskUserRecords = await models.TaskUserModel.findAll({
        where: { idTask: idTask }
      });
      if (taskUserRecords.length === 0) throw "This task is not exist";
      else
        taskUserRecords = taskUserRecords.map(record => {
          return record.dataValues;
        });
      let isInTask = false;
      let memberList = [];
      for (let i = 0; i < taskUserRecords.length; i++) {
        if (taskUserRecords[i].idUser === user.idUser) isInTask = true;
        let memberInfo = await models.UserModel.findOne({
          attributes: {
            exclude: models.excludeFieldsForUserInfo
          },
          where: { idUser: taskUserRecords[i].idUser },
          raw: true
        });
        memberList.push(memberInfo);
      }
      if (isInTask)
        return response.success(res, "Get list of members success", memberList);
      else throw "This account is not in this task";
    } catch (e) {
      console.log(e);
      return response.error(res, "Get list of tasks fail", e);
    }
  },
  createTask: async (req, res, next) => {
    let { user } = req;
    let { name, description, points, idProject, finishedAt, type, duration } = req.body;
    try {
      // if (!user) throw "User not found";
      validator.validateTaskInfo({
        name,
        description,
        points,
        finishedAt,
        type,
        duration,
        idProject
      });
      finishedAt = helpers.convertDateToDATE(finishedAt, "finishedAt");
      validator.isInFuture(finishedAt, "finishedAt");

      // Check idProject
      let project = models.ProjectModel.findOne({ where: { idProject: idProject } });

      const newTask = await models.TaskModel.create({
        name,
        description,
        finishedAt,
        points,
        type,
        duration,
        idProject: idProject
      });
      await models.TaskUserModel.create({
        idUser: user.idUser,
        idRole: 2,
        idTask: newTask.idTask
      });
      return response.created(res, "Create task success", newTask.dataValues);
    } catch (e) {
      console.log(e);
      return response.error(res, "Create task fail", e);
    }
  },
  updateTask: async (req, res, next) => {
    let { user } = req;
    let { idTask, name, description, priority, finishedAt, state } = req.body;
    try {
      // Validation
      // if (!user) throw "User not found";
      if (typeof idTask === "undefined") throw "Missing idTask field";
      if (parseInt(idTask) === NaN) throw "idTask field must be integer";
      let taskRecord = await models.TaskModel.findOne({
        where: { idTask: idTask },
        raw: true
      });
      if (!taskRecord) throw "This task not exist";
      if (typeof name === "undefined") name = taskRecord.name;
      if (typeof priority === "undefined") priority = taskRecord.priority;
      if (typeof state === "undefined") state = taskRecord.state;
      if (typeof finishedAt === "undefined") finishedAt = taskRecord.finishedAt;
      finishedAt = helpers.convertDateToDATE(finishedAt, "finishedAt");
      validator.isInFuture(finishedAt, "finishedAt");

      if (typeof description === "undefined") description = null;

      const updatedTask = await models.TaskModel.update(
        {
          name,
          short_name: helpers.shortenNameHelper(name),
          description,
          state: parseInt(state),
          priority: parseInt(priority),
          finishedAt
        },
        { where: { idTask: idTask }, raw: true }
      );
      return response.accepted(res, "Update task success", updatedTask);
    } catch (e) {
      console.log(e);
      return response.error(res, "Update task fail", e);
    }
  },
  removeTask: async (req, res, next) => {
    try {
      const { user } = req;
      const { idTask } = req.body;
      let taskRecord = await models.TaskModel.findOne({
        where: { idTask: idTask }
      });
      if (!taskRecord) throw "Task not exist";
      let isAdmin = await models.TaskUserModel.findOne({
        where: { idUser: user.idUser, idRole: 2, idTask: idTask }
      });
      if (!isAdmin) throw "This account is not the admin in this task";
      else {
        await models.TaskUserModel.destroy({ where: { idTask: idTask } });
        await models.TaskModel.destroy({ where: { idTask: idTask } });
        return response.success(res, "Remove task success");
      }
    } catch (e) {
      console.log(e);
      return response.error(res, "Remove task fail", e);
    }
  },
  addMembers: async (req, res, next) => {
    let { user } = req;
    let { idTask, members } = req.body;
    try {
      let taskRecord = await models.TaskModel.findOne({
        where: { idTask: idTask }
      });
      if (!taskRecord) throw "Task not exist";
      else taskRecord = taskRecord.dataValues;
      let taskUserRecord = await models.TaskUserModel.findOne({
        where: {
          idTask: idTask,
          idUser: user.idUser,
          idRole: 2
        },
        raw: true
      });
      if (!taskUserRecord) throw "This account is not admin in this task";
      for (let i = 0; i < members.length; i++) {
        let memberRecord = await models.TeamUserModel.findOne({
          where: {
            idUser: members[i],
            idTeam: taskRecord.creator
          }
        });
        if (!memberRecord) throw `Member who has id=${members[i]} is not in the team`;
      }
      for (let i = 0; i < members.length; i++)
        await models.TaskUserModel.findOrCreate({
          where: { idUser: members[i], idTask: idTask },
          defaults: { idRole: 3 }
        });

      return response.created(res, "Add task's member success");
    } catch (e) {
      console.log(e);
      return response.error(res, "Add task's member success", e);
    }
  },
  removeMembers: async (req, res, next) => {
    let { user } = req;
    let { idTask, members } = req.body;
    try {
      let taskRecord = await models.TaskModel.findOne({
        where: { idTask: idTask },
        raw: true
      });
      if (!taskRecord) throw "Task not exist";
      let taskUserRecord = await models.TaskUserModel.findOne({
        where: {
          idTask: idTask,
          idUser: user.idUser,
          idRole: 2
        },
        raw: true
      });
      if (!taskUserRecord) throw "This account is not admin in this task";
      if (members.includes(user.idUser)) members.splice(members.indexOf(user.idUser), 1);

      let result = await models.TaskUserModel.destroy({
        where: { idUser: { [Op.in]: members } }
      });
      if (result === 0) throw "Non of these members are in this task";
      return response.accepted(res, "Remove task's member success");
    } catch (e) {
      console.log(e);
      return response.error(res, "Add task's member success", e);
    }
  }
};
