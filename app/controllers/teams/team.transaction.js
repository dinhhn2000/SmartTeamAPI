"use strict";
const models = require("../../models");
const { Op } = require("sequelize");
const db = require("../../utils/DB");
const helpers = require("../../utils/Helpers");

module.exports = {
  createTeam: async (name, idUser) => {
    return db.sequelize.transaction().then(async t => {
      try {
        // Create new Team
        if (typeof name === "undefined") throw "Missing name field";
        const newTeam = await models.TeamModel.create(
          {
            name,
            creator: idUser,
            avatar: "https://icon-library.net/images/bot-icon/bot-icon-18.jpg"
          },
          { transaction: t }
        );
        await models.TeamUserModel.create(
          { idUser, idRole: 2, idTeam: newTeam.idTeam },
          { transaction: t }
        );

        await t.commit();
        return newTeam;
      } catch (e) {
        console.log(e.errors);
        if (t) await t.rollback();
        // Database errors
        if (e.errors !== undefined) throw e.errors.map(error => error.message);
        throw e;
      }
    });
  },
  removeTeam: async (idTeam, idUser) => {
    return db.sequelize.transaction().then(async t => {
      try {
        let teamRecord = await models.TeamModel.findOne({
          where: { idTeam: idTeam }
        });
        if (!teamRecord) throw "Team not exist";

        let isAdmin = await models.TeamUserModel.findOne({
          where: { idUser, idRole: 2, idTeam: idTeam }
        });
        if (!isAdmin) throw "This account is not the admin in this team";

        await models.TeamUserModel.destroy({
          where: { idTeam: idTeam },
          transaction: t
        });
        await models.TeamModel.destroy({
          where: { idTeam: idTeam },
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
  addMembers: async (idTeam, members, idUser) => {
    return db.sequelize.transaction().then(async t => {
      try {
        let teamRecord = await models.TeamModel.findOne({
          where: { idTeam: idTeam },
          raw: true
        });
        if (!teamRecord) throw "Team not exist";

        let adminRecord = await models.TeamUserModel.findOne({
          where: { idTeam: idTeam, idUser, idRole: 2 },
          raw: true
        });
        if (!adminRecord) throw "This account is not admin in this team";

        let teamUserRecords = await models.TeamUserModel.findAll({
          where: { idUser: { [Op.in]: members }, idTeam: idTeam },
          raw: true
        });
        if (teamUserRecords.length > 0)
          throw "Some of the members are already in the team";

        let memberRecord = await models.UserModel.findAll({
          where: { idUser: { [Op.in]: members } }
        });
        if (memberRecord.length < members.length)
          throw `Some of the members are not existed`;

        let data = members.map(member => {
          return { idUser: member, idTeam: idTeam, idRole: 3 };
        });
        await models.TeamUserModel.bulkCreate(data, { transaction: t });

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
  removeMembers: async (idTeam, members, idUser) => {
    return db.sequelize.transaction().then(async t => {
      try {
        let teamRecord = await models.TeamModel.findOne({
          where: { idTeam: idTeam },
          raw: true
        });
        if (!teamRecord) throw "Team not exist";

        let teamUserRecord = await models.TeamUserModel.findOne({
          where: { idTeam: idTeam, idUser, idRole: 2 },
          raw: true
        });
        if (!teamUserRecord) throw "This account is not admin in this team";

        if (members.includes(idUser)) members.splice(members.indexOf(idUser), 1);
        let result = await models.TeamUserModel.destroy({
          where: { idUser: { [Op.in]: members } }
        });
        if (result === 0) throw "Non of these members are in this team";

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
