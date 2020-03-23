"use strict";
const response = require("../../utils/Responses");
const { TeamModel, TeamUserModel, UserModel } = require("../../models");
const { Op } = require("sequelize");

module.exports = {
  getTeamList: async (req, res, next) => {
    try {
      let { user } = req;
      if (!user) throw "User not found";
      let teamUserRecords = await TeamUserModel.findAll({
        where: {
          id_user: user.id_user
        }
      });
      let teamListIndex = teamUserRecords.map(record => {
        return record.dataValues.id_team;
      });
      let teamList = [];
      for (let i = 0; i < teamListIndex.length; i++) {
        let team = await TeamModel.findOne({
          where: {
            id_team: teamListIndex[i]
          }
        });
        teamList.push(team.dataValues);
      }
      return response.success(res, "Get list of teams success", teamList);
    } catch (e) {
      console.log(e);
      return response.error(res, "Get list of teams fail", e);
    }
  },
  getTeamMemberList: async (req, res, next) => {
    try {
      let { user } = req;
      let { teamId } = req.body;
      let teamUserRecords = await TeamUserModel.findAll({
        where: { id_team: teamId }
      });
      if (teamUserRecords.length === 0) throw "This team is not exist";
      else
        teamUserRecords = teamUserRecords.map(record => {
          return record.dataValues;
        });
      let isInTeam = false;
      let memberList = [];
      for (let i = 0; i < teamUserRecords.length; i++) {
        if (teamUserRecords[i].id_user === user.id_user) isInTeam = true;
        let memberInfo = await UserModel.findOne({
          attributes: {
            exclude: [
              "email",
              "password",
              "gender",
              "dob",
              "googleId",
              "facebookId",
              "is_verified"
            ]
          },
          where: { id_user: teamUserRecords[i].id_user }
        });
        memberList.push(memberInfo.dataValues);
      }
      if (isInTeam)
        return response.success(res, "Get list of members success", memberList);
      else throw "This account is not in this team";
    } catch (e) {
      console.log(e);
      return response.error(res, "Get list of team's member fail", e);
    }
  },
  createTeam: async (req, res, next) => {
    let { user } = req;
    let { name } = req.body;
    try {
      if (!user) throw "User not found";
      if (typeof name === "undefined") throw "Missing name field";
      const newTeam = await TeamModel.create({
        name,
        creator: user.id_user,
        avatar: "https://icon-library.net/images/bot-icon/bot-icon-18.jpg"
      });
      await TeamUserModel.create({
        id_user: user.id_user,
        id_role: 2,
        id_team: newTeam.id_team
      });
      return response.created(res, "Create team success");
    } catch (e) {
      // console.log(e);
      return response.error(res, "Create team fail", e);
    }
  },
  addMembers: async (req, res, next) => {
    let { user } = req;
    let { teamId, members } = req.body;
    try {
      if (!user) throw "User not found";
      let teamRecord = await TeamModel.findOne({
        where: { id_team: teamId },
        raw: true
      });
      if (!teamRecord) throw "Project not exist";
      let teamUserRecords = await TeamUserModel.findOne({
        where: {
          id_user: user.id_user,
          id_team: teamId,
          id_role: 2
        }
      });
      if (!teamUserRecords) throw "This account is not the admin in this team";
      else teamUserRecords = teamUserRecords.dataValues;
      for (let i = 0; i < members.length; i++) {
        let memberRecord = await UserModel.findOne({
          where: { id_user: members[i] }
        });
        if (!memberRecord) throw `Member who has id=${members[i]} is not exist`;
      }
      for (let i = 0; i < members.length; i++) {
        await TeamUserModel.findOrCreate({
          where: { id_user: members[i], id_team: teamId },
          defaults: { id_role: 3 }
        });
      }
      return response.created(res, "Add team's member success");
    } catch (e) {
      // console.log(e);
      return response.error(res, "Add team's member fail", e);
    }
  },
  removeMembers: async (req, res, next) => {
    let { user } = req;
    let { teamId, members } = req.body;
    try {
      let teamRecord = await TeamModel.findOne({
        where: { id_team: teamId },
        raw: true
      });
      if (!teamRecord) throw "Team not exist";
      let teamUserRecord = await TeamUserModel.findOne({
        where: {
          id_team: teamId,
          id_user: user.id_user,
          id_role: 2
        },
        raw: true
      });
      if (!teamUserRecord) throw "This account is not admin in this team";
      if (members.includes(user.id_user))
        members.splice(members.indexOf(user.id_user), 1);
      let result = await TeamUserModel.destroy({
        where: { id_user: { [Op.in]: members } }
      });
      if (result === 0) throw "Non of these members are in this team";
      return response.accepted(res, "Remove project's member success");
    } catch (e) {
      console.log(e);
      return response.error(res, "Add project's member success", e);
    }
  }
};
