"use strict";
const response = require("../../utils/Responses");
const models = require("../../models");
const transactions = require("./team.transaction");
const { Op } = require("sequelize");

module.exports = {
  getTeamList: async (req, res, next) => {
    let { user } = req;
    try {
      // if (!user) throw "User not found";
      let teamUserRecords = await models.TeamUserModel.findAll({
        where: { idUser: user.idUser },
        raw: true
      });
      let teamListIndex = teamUserRecords.map(record => record.idTeam);
      let teamList = await models.TeamModel.findAll({
        where: { idTeam: { [Op.in]: teamListIndex } },
        raw: true
      });
      return response.success(res, "Get list of teams success", teamList);
    } catch (e) {
      console.log(e);
      return response.error(res, "Get list of teams fail", e);
    }
  },
  getTeamMemberList: async (req, res, next) => {
    try {
      let { user } = req;
      let { idTeam } = req.body;
      let membersId = await models.TeamUserModel.findAll({
        attributes: ["idUser"],
        where: { idTeam: idTeam },
        raw: true
      });
      if (membersId.length === 0) throw "This team is not exist";
      membersId = membersId.map(e => e.idUser);
      if (!membersId.includes(user.idUser)) throw "This account is not in this team";
      let membersInfo = await models.UserModel.findAll({
        attributes: {
          exclude: models.excludeFieldsForUserInfo
        },
        where: { idUser: { [Op.in]: membersId } }
      });
      return response.success(res, "Get list of members success", membersInfo);
    } catch (e) {
      console.log(e);
      return response.error(res, "Get list of team's member fail", e);
    }
  },
  createTeam: async (req, res, next) => {
    let { user } = req;
    let { name } = req.body;
    try {
      // if (!user) throw "User not found";
      await transactions.createTeam(name, user.idUser);
      return response.created(res, "Create team success");
    } catch (e) {
      // console.log(e);
      return response.error(res, "Create team fail", e);
    }
  },
  addMembers: async (req, res, next) => {
    let { user } = req;
    let { idTeam, members } = req.body;
    try {
      // if (!user) throw "User not found";
      await transactions.addMembers(idTeam, members, user.idUser);
      return response.created(res, "Add team's member success");
    } catch (e) {
      // console.log(e);
      return response.error(res, "Add team's member fail", e);
    }
  },
  removeMembers: async (req, res, next) => {
    let { user } = req;
    let { idTeam, members } = req.body;
    try {
      await transactions.removeMembers(idTeam, members, user.idUser);
      return response.accepted(res, "Remove project's member success");
    } catch (e) {
      console.log(e);
      return response.error(res, "Remove project's member fail", e);
    }
  }
};
