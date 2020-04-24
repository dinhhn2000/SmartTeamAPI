"use strict";
const models = require("../../../utils/Models");
const db = require("../../../utils/DB");
const constants = require("../../../utils/Constants");
const { Op } = require("sequelize");
const { sendEmail, createAnnounceEmail } = require("../../../utils/Email");

module.exports = {
  createTask: async (taskInfo) => {
    try {
      // Create new Task
      taskInfo.state = 2; // State 2: Open
      const newTask = await models.TaskModel.create(taskInfo);

      // Get project's info
      let projectInfo = await models.ProjectModel.findOne({
        where: { idProject: taskInfo.idProject },
        raw: true,
      });

      // Send email to member
      if (taskInfo.idUser !== undefined) {
        let memberInfo = await models.UserModel.findOne({
          where: { idUser: taskInfo.idUser, email: { [Op.not]: null } },
          raw: true,
        });
        if (!!memberInfo) {
          let sendData = { taskName: newTask.name, projectName: projectInfo.name };
          await sendEmail(
            createAnnounceEmail(memberInfo.email, constants.ASSIGNED_TO_TASK, sendData)
          );
        }
      }

      return newTask;
    } catch (e) {
      // Database errors
      if (e.errors !== undefined) throw e.errors.map((error) => error.message);
      throw e;
    }
  },
  removeTask: async (idTask, idUser) => {
    return db.sequelize.transaction(async (t) => {
      try {
        // Check task
        let taskRecord = await models.TaskModel.findOne({ where: { idTask }, raw: true });
        if (!taskRecord) throw "Task not exist";

        // Check admin
        let isAdmin = await models.ProjectUserModel.findOne({
          where: { idUser, idRole: 2, idProject: taskRecord.idProject },
        });
        if (!isAdmin) throw "This account is not the admin in this project";
        else {
          await models.TaskModel.destroy({ where: { idTask }, transaction: t });
        }

        return true;
      } catch (e) {
        // Database errors
        if (e.errors !== undefined) throw e.errors.map((error) => error.message);
        throw e;
      }
    });
  },
  addMember: async (idTask, member, idUser) => {
    return db.sequelize.transaction(async (t) => {
      try {
        // Check task
        let taskRecord = await models.TaskModel.findOne({ where: { idTask }, raw: true });
        if (!taskRecord) throw "Task not exist";

        // Check admin
        let isAdmin = await models.ProjectUserModel.findOne({
          where: { idUser, idRole: 2, idProject: taskRecord.idProject },
        });
        if (!isAdmin) throw "This account is not the admin in this project";

        // Check if member already in task
        if (!!taskRecord.idUser) throw "This task already has been assigned";

        // Check if member is in the project
        let memberRecord = await models.ProjectUserModel.findOne({
          where: { idUser: member, idProject: taskRecord.idProject },
        });
        if (memberRecord) throw `This member not in this project`;

        // Add member
        await models.TaskModel.update(
          { idUser: member, state: 6 }, // State 6: assigned
          { where: { idTask }, transaction: t }
        );

        // Get project's info
        let projectInfo = await models.ProjectModel.findOne({
          where: { idProject: taskRecord.idProject },
          raw: true,
        });

        // Send email to member
        let memberInfo = await models.UserModel.findOne({ where: { idUser: member }, raw: true });
        if (memberInfo.email !== null) {
          let sendData = { taskName: taskRecord.name, projectName: projectInfo.name };
          await sendEmail(
            createAnnounceEmail(memberInfo.email, constants.ASSIGNED_TO_TASK, sendData)
          );
        }

        return true;
      } catch (e) {
        // Database errors
        if (e.errors !== undefined) throw e.errors.map((error) => error.message);
        throw e;
      }
    });
  },
  updateMember: async (idTask, member, idUser) => {
    return db.sequelize.transaction(async (t) => {
      try {
        // Check task
        let taskRecord = await models.TaskModel.findOne({ where: { idTask }, raw: true });
        if (!taskRecord) throw "Task not exist";

        // Check admin
        let isAdmin = await models.ProjectUserModel.findOne({
          where: { idUser, idRole: 2, idProject: taskRecord.idProject },
        });
        if (!isAdmin) throw "This account is not the admin in this project";

        // Check if member is in the project
        let memberRecord = await models.ProjectUserModel.findOne({
          where: { idUser: member, idProject: taskRecord.idProject },
        });
        if (!memberRecord) throw `This member not in this project`;

        // Update member
        await models.TaskModel.update({ idUser: member }, { where: { idTask }, transaction: t });

        // Get project's info
        let projectInfo = await models.ProjectModel.findOne({
          where: { idProject: taskRecord.idProject },
          raw: true,
        });

        // Send email to old member
        let oldMemberInfo = await models.UserModel.findOne({
          where: { idUser: taskRecord.idUser },
          raw: true,
        });
        if (oldMemberInfo.email !== null) {
          let sendData = { taskName: taskRecord.name };
          await sendEmail(
            createAnnounceEmail(oldMemberInfo.email, constants.ASSIGNED_TO_ANOTHER_PERSON, sendData)
          );
        }

        // Send email to new member
        let newMemberInfo = await models.UserModel.findOne({
          where: { idUser: member },
          raw: true,
        });
        if (newMemberInfo.email !== null) {
          let sendData = { taskName: taskRecord.name, projectName: projectInfo.name };
          await sendEmail(
            createAnnounceEmail(newMemberInfo.email, constants.ASSIGNED_TO_TASK, sendData)
          );
        }

        return true;
      } catch (e) {
        // Database errors
        if (e.errors !== undefined) throw e.errors.map((error) => error.message);
        throw e;
      }
    });
  },
  removeMember: async (idTask, member, idUser) => {
    return db.sequelize.transaction(async (t) => {
      try {
        // Check member
        let memberInfo = await models.UserModel.findOne({ where: { idUser: member }, raw: true });
        if (!memberInfo) throw "This member not exist";

        // Check task
        let taskRecord = await models.TaskModel.findOne({ where: { idTask }, raw: true });
        if (!taskRecord) throw "Task not exist";

        // Check admin
        let isAdmin = await models.ProjectUserModel.findOne({
          where: { idUser, idRole: 2, idProject: taskRecord.idProject },
        });
        if (!isAdmin) throw "This account is not the admin in this project";

        // Check in task
        if (member !== taskRecord.idUser) throw "This member is not in this task";

        // Remove member
        await models.TaskModel.update({ idUser: null }, { where: { idTask }, transaction: t });

        // Send email to member
        if (memberInfo.email !== null) {
          let sendData = { taskName: taskRecord.name };
          await sendEmail(
            createAnnounceEmail(memberInfo.email, constants.TASK_UNASSIGNED, sendData)
          );
        }

        return true;
      } catch (e) {
        // Database errors
        if (e.errors !== undefined) throw e.errors.map((error) => error.message);
        throw e;
      }
    });
  },
};
