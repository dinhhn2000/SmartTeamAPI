"use strict";
const models = require("../../../utils/Models");
const db = require("../../../utils/DB");

module.exports = {
  createTask: async (taskInfo) => {
    try {
      // Create new Task
      taskInfo.state = 2; // State 2: Open
      const newTask = await models.TaskModel.create(taskInfo);
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
        if (memberRecord) throw `This member not in this project`;

        // Update member
        await models.TaskModel.update(
          { idUser: member },
          { where: { idTask }, transaction: t }
        );

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
        let memberRecord = await models.UserModel.findOne({ where: { idUser: member } });
        if (!memberRecord) throw "This member not exist";

        // Check task
        let taskRecord = await models.TaskModel.findOne({ where: { idTask }, raw: true });
        if (!taskRecord) throw "Task not exist";

        // Check admin
        let isAdmin = await models.ProjectUserModel.findOne({
          where: { idUser, idRole: 2, idProject: taskRecord.idProject },
        });
        if (!isAdmin) throw "This account is not the admin in this project";

        // Check in project
        if (member !== taskRecord.idUser) throw "This member is not in this task";

        // Remove member
        await models.TaskModel.update(
          { idUser: null },
          { where: { idTask }, transaction: t }
        );

        return true;
      } catch (e) {
        // Database errors
        if (e.errors !== undefined) throw e.errors.map((error) => error.message);
        throw e;
      }
    });
  },
};
