"use strict";
const models = require("../../models");
const { Op } = require("sequelize");
const db = require("../../utils/DB");

module.exports = {
  createTask: async (
    name,
    idProject,
    description,
    points,
    finishedAt,
    type,
    duration,
    idUser
  ) => {
    return db.sequelize.transaction().then(async t => {
      try {
        // Create new Task
        const newTask = await models.TaskModel.create(
          {
            name,
            short_name: helpers.shortenNameHelper(name),
            creator: parseInt(idTeam),
            description,
            state: 2,
            priority: parseInt(priority),
            finishedAt
          },
          { transaction: t }
        );
        await models.TaskUserModel.create(
          {
            idUser: user.idUser,
            idRole: 2,
            idTask: newTask.idTask
          },
          { transaction: t }
        );

        await t.commit();
        return newTask;
      } catch (e) {
        console.log(e);
        if (t) await t.rollback();
        throw e.message;
      }
    });
  },
  removeTask: async (idTask, idUser) => {
    return db.sequelize.transaction().then(async t => {
      try {
        let taskRecord = await models.TaskModel.findOne({
          where: { idTask: idTask }
        });
        if (!taskRecord) throw "Task not exist";
        let isAdmin = await models.TaskUserModel.findOne({
          where: { idUser, idRole: 2, idTask: idTask }
        });
        if (!isAdmin) throw "This account is not the admin in this task";

        await models.TaskUserModel.destroy({
          where: { idTask: idTask },
          transaction: t
        });
        await models.TaskModel.destroy({
          where: { idTask: idTask },
          transaction: t
        });
        await t.commit();
        return true;
      } catch (e) {
        console.log(e);
        if (t) await t.rollback();
        if (e.message === undefined) throw e;
        else throw e.message;
      }
    });
  },
  addMembers: async (idTask, members, idUser) => {
    return db.sequelize.transaction().then(async t => {
      try {
        let taskRecord = await models.TaskModel.findOne({
          where: { idTask: idTask },
          raw: true
        });
        if (!taskRecord) throw "Task not exist";
        let taskUserRecord = await models.TaskUserModel.findOne({
          where: { idTask: idTask, idUser, idRole: 2 },
          raw: true
        });
        if (!taskUserRecord) throw "This account is not admin in this task";
        // Check if all members are in the team
        let memberRecord = await models.TeamUserModel.findAll({
          where: { idUser: { [Op.in]: members }, idTeam: taskRecord.creator }
        });
        if (memberRecord.length !== members.length)
          throw `Some of the members are not in the team`;
        // Add member
        members.map(async member => {
          return await models.TaskUserModel.findOrCreate({
            where: { idUser: member, idTask: idTask },
            defaults: { idRole: 3 },
            transaction: t
          });
        });

        await t.commit();
        return true;
      } catch (e) {
        console.log(e);
        if (t) await t.rollback();
        if (e.message === undefined) throw e;
        else throw e.message;
      }
    });
  },
  removeMembers: async (idTask, members, idUser) => {
    return db.sequelize.transaction().then(async t => {
      try {
        let taskRecord = await models.TaskModel.findOne({
          where: { idTask: idTask },
          raw: true
        });
        if (!taskRecord) throw "Task not exist";
        let taskUserRecord = await models.TaskUserModel.findOne({
          where: { idTask: idTask, idUser, idRole: 2 },
          raw: true
        });
        if (!taskUserRecord) throw "This account is not admin in this task";
        if (members.includes(idUser)) members.splice(members.indexOf(idUser), 1);

        let result = await models.TaskUserModel.destroy({
          where: { idUser: { [Op.in]: members } }
        });
        if (result === 0) throw "Non of these members are in this task";

        await t.commit();
        return true;
      } catch (e) {
        console.log(e);
        if (t) await t.rollback();
        if (e.message === undefined) throw e;
        else throw e.message;
      }
    });
  }
};
