"use strict";
const models = require("../../models");
const { Op } = require("sequelize");
const db = require("../../utils/DB");

module.exports = {
  createTask: async taskInfo => {
    try {
      // Create new Task
      const newTask = await models.TaskModel.create(taskInfo);
      return newTask;
    } catch (e) {
      console.log(e);
      // Database errors
      if (e.errors !== undefined) throw e.errors.map(error => error.message);
      throw e;
    }
    // BUG (Fix later)
    /*
Cannot add transaction to this create method:
+ The create method sucess
+ Transaction commited
+ DB check contrain & throw error
+ Cannot rollback transaction because it has been commited
+ Server return error `Transaction cannot be rolled back because it has been finished with state: commit`
*/
  },
  removeTask: async (idTask, idUser) => {
    return db.sequelize.transaction().then(async t => {
      try {
        // Check task
        let taskRecord = await models.TaskModel.findOne({ where: { idTask }, raw: true });
        if (!taskRecord) throw "Task not exist";

        // Check admin
        let isAdmin = await models.ProjectUserModel.findOne({
          where: { idUser, idRole: 2, idProject: taskRecord.idProject }
        });
        if (!isAdmin) throw "This account is not the admin in this project";
        else {
          await models.TaskUserModel.destroy({ where: { idTask }, transaction: t });
          await models.TaskModel.destroy({ where: { idTask }, transaction: t });
        }

        await t.commit();
        return true;
      } catch (e) {
        if (t) await t.rollback();
        // Database errors
        if (e.errors !== undefined) throw e.errors.map(error => error.message);
        throw e;
      }
    });
  },
  addMembers: async (idTask, members, idUser) => {
    return db.sequelize.transaction().then(async t => {
      try {
        // Check task
        let taskRecord = await models.TaskModel.findOne({ where: { idTask }, raw: true });
        if (!taskRecord) throw "Task not exist";

        // Check admin
        let isAdmin = await models.ProjectUserModel.findOne({
          where: { idUser, idRole: 2, idProject: taskRecord.idProject }
        });
        if (!isAdmin) throw "This account is not the admin in this project";

        // Check if any member already in task
        let taskUserRecords = await models.TaskUserModel.findAll({
          where: { idTask, idUser: { [Op.in]: members } },
          raw: true
        });
        if (taskUserRecords.length > 0)
          throw "Some of the members are already in the team";

        // Check if all members are in the project
        let memberRecord = await models.ProjectUserModel.findAll({
          where: { idUser: { [Op.in]: members }, idProject: taskRecord.idProject }
        });
        if (memberRecord.length < members.length)
          throw `Some of the members are not in the project`;

        // Add member
        let data = members.map(member => {
          return { idUser: member, idTask };
        });
        await models.TaskUserModel.bulkCreate(data, { transaction: t });

        await t.commit();
        return true;
      } catch (e) {
        if (t) await t.rollback();
        // Database errors
        if (e.errors !== undefined) throw e.errors.map(error => error.message);
        throw e;
      }
    });
  },
  removeMembers: async (idTask, members, idUser) => {
    return db.sequelize.transaction().then(async t => {
      try {
        // Check task
        let taskRecord = await models.TaskModel.findOne({ where: { idTask }, raw: true });
        if (!taskRecord) throw "Task not exist";

        // Check admin
        let isAdmin = await models.ProjectUserModel.findOne({
          where: { idUser, idRole: 2, idProject: taskRecord.idProject }
        });
        if (!isAdmin) throw "This account is not the admin in this project";

        if (members.includes(idUser)) members.splice(members.indexOf(idUser), 1);
        let result = await models.TaskUserModel.destroy({
          where: { idUser: { [Op.in]: members } }
        });
        if (result === 0) throw "Non of these members are in this task";

        await t.commit();
        return true;
      } catch (e) {
        if (t) await t.rollback();
        // Database errors
        if (e.errors !== undefined) throw e.errors.map(error => error.message);
        throw e;
      }
    });
  }
};
