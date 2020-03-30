"use strict";
const models = require("../../models");
const { Op } = require("sequelize");
const db = require("../../utils/DB");
const helpers = require("../../utils/Helpers");

module.exports = {
  createProject: async ({ name, idTeam, description, priority, finishedAt, idUser }) => {
    return db.sequelize.transaction().then(async t => {
      try {
        // Create new Project
        let newProject = await models.ProjectModel.create(
          {
            name,
            short_name: helpers.shortenName(name),
            idTeam: idTeam,
            description,
            state: 2,
            priority,
            finishedAt
          },
          { transaction: t }
        );
        await models.ProjectUserModel.create(
          {
            idUser,
            idRole: 2,
            idProject: newProject.idProject
          },
          { transaction: t }
        );
        await t.commit();
        return newProject;
      } catch (e) {
        if (t) await t.rollback();
        // Database errors
        if (e.errors !== undefined) throw e.errors.map(error => error.message);
        throw e;
      }
    });
  },
  removeProject: async (idProject, idUser) => {
    return db.sequelize.transaction().then(async t => {
      try {
        let projectRecord = await models.ProjectModel.findOne({
          where: { idProject }
        });
        if (!projectRecord) throw "Project not exist";
        let isAdmin = await models.ProjectUserModel.findOne({
          where: { idUser, idRole: 2, idProject }
        });
        if (!isAdmin) throw "This account is not the admin in this project";

        await models.ProjectUserModel.destroy({
          where: { idProject },
          transaction: t
        });
        await models.ProjectModel.destroy({
          where: { idProject },
          transaction: t
        });
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
  addMembers: async (idProject, members, idUser) => {
    return db.sequelize.transaction().then(async t => {
      try {
        let projectRecord = await models.ProjectModel.findOne({
          where: { idProject },
          raw: true
        });
        if (!projectRecord) throw "Project not exist";

        let adminRecord = await models.ProjectUserModel.findOne({
          where: { idProject, idUser, idRole: 2 },
          raw: true
        });
        if (!adminRecord) throw "This account is not admin in this project";

        // Check if any member already in project
        let projectUserRecords = await models.ProjectUserModel.findAll({
          where: { idProject, idUser: { [Op.in]: members } },
          raw: true
        });
        if (projectUserRecords.length > 0)
          throw "Some of the members are already in the team";

        // Check if all members are in the team
        let memberRecord = await models.TeamUserModel.findAll({
          where: { idUser: { [Op.in]: members }, idTeam: projectRecord.idTeam }
        });
        if (memberRecord.length < members.length)
          throw `Some of the members are not in the team`;

        // Add member
        let data = members.map(member => {
          return { idUser: member, idProject, idRole: 3 };
        });
        await models.ProjectUserModel.bulkCreate(data, { transaction: t });

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
  removeMembers: async (idProject, members, idUser) => {
    return db.sequelize.transaction().then(async t => {
      try {
        let projectRecord = await models.ProjectModel.findOne({
          where: { idProject },
          raw: true
        });
        if (!projectRecord) throw "Project not exist";
        let projectUserRecord = await models.ProjectUserModel.findOne({
          where: { idProject, idUser, idRole: 2 },
          raw: true
        });
        if (!projectUserRecord) throw "This account is not admin in this project";

        if (members.includes(idUser)) members.splice(members.indexOf(idUser), 1);
        let result = await models.ProjectUserModel.destroy({
          where: { idUser: { [Op.in]: members } }
        });
        if (result === 0) throw "Non of these members are in this project";

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
