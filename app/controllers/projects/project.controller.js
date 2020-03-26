"use strict";
const response = require("../../utils/Responses");
const models = require("../../models");
const transactions = require("./project.transaction");
const helpers = require("../../utils/Helpers");
const validator = require("../../utils/Validations/validations");
const { Op } = require("sequelize");

module.exports = {
  getProjectList: async (req, res, next) => {
    try {
      let { user } = req;
      // Get projects id
      let projectListIndex = await models.ProjectUserModel.findAll({
        attributes: ["idProject"],
        where: { idUser: user.idUser },
        raw: true
      });
      if (projectListIndex.length === 0)
        return response.success(res, "This account is not in any project", []);
      projectListIndex = projectListIndex.map(e => e.idProject);
      // Get projects info
      let projectList = await models.ProjectModel.findAll({
        where: { idProject: { [Op.in]: projectListIndex } },
        raw: true
      });
      return response.success(res, "Get list of projects success", projectList);
    } catch (e) {
      // console.log(e);
      return response.error(res, "Get list of projects fail", e);
    }
  },
  getProjectMemberList: async (req, res, next) => {
    try {
      let { user } = req;
      let { idProject } = req.body;
      // Get projects' members id
      let membersId = await models.ProjectUserModel.findAll({
        attributes: ["idUser"],
        where: { idProject: idProject },
        raw: true
      });
      if (membersId.length === 0) throw "This project is not exist";
      membersId = membersId.map(e => e.idUser);
      if (!membersId.includes(user.idUser)) throw "This account is not in this project";
      // Get members' info
      let membersInfo = await models.UserModel.findAll({
        attributes: {
          exclude: models.excludeFieldsForUserInfo
        },
        where: { idUser: { [Op.in]: membersId } },
        raw: true
      });
      if (membersInfo.length > 0)
        return response.success(res, "Get list of members success", membersInfo);
    } catch (e) {
      console.log(e);
      return response.error(res, "Get list of projects fail", e);
    }
  },
  createProject: async (req, res, next) => {
    let { user } = req;
    let { name, description, priority, idTeam, finishedAt } = req.body;
    try {
      // if (!user) throw "User not found";
      let teamUserRecord = await models.TeamUserModel.findOne({
        where: { idTeam: idTeam, idUser: user.idUser, idRole: 2 }
      });
      if (!teamUserRecord) throw "This account is not admin in this team";

      // Validate fields
      validator.validateProjectInfo(req.body);
      finishedAt = helpers.convertDateToDATE(finishedAt, "finishedAt");
      validator.isInFuture(finishedAt, "finishedAt");

      // Call create transaction
      let newProject = await transactions.createProject({
        ...req.body,
        idUser: user.idUser
      });
      return response.created(res, "Create project success", newProject);
    } catch (e) {
      console.log(e);
      return response.error(res, "Create project fail", e);
    }
  },
  updateProject: async (req, res, next) => {
    let { user } = req;
    let { idProject, name, description, priority, finishedAt, state } = req.body;
    try {
      // Validation
      // if (!user) throw "User not found";
      if (typeof idProject === "undefined") throw "Missing idProject field";
      if (parseInt(idProject) === NaN) throw "idProject field must be integer";
      let projectRecord = await models.ProjectModel.findOne({
        where: { idProject: idProject },
        raw: true
      });
      if (!projectRecord) throw "This project not exist";
      let teamUserRecord = await models.TeamUserModel.findOne({
        where: { idTeam: projectRecord.idTeam, idUser: user.idUser, idRole: 2 }
      });
      if (!teamUserRecord) throw "This account is not admin in this team";
      if (typeof name === "undefined") name = projectRecord.name;
      if (typeof priority === "undefined") priority = projectRecord.priority;
      if (typeof state === "undefined") state = projectRecord.state;
      if (typeof finishedAt === "undefined") finishedAt = projectRecord.finishedAt;
      finishedAt = helpers.convertDateToDATE(finishedAt, "finishedAt");
      validator.isInFuture(finishedAt, "finishedAt");
      if (typeof description === "undefined") description = null;

      const updatedProject = await models.ProjectModel.update(
        {
          name,
          short_name: helpers.shortenNameHelper(name),
          description,
          state: parseInt(state),
          priority: parseInt(priority),
          finishedAt
        },
        { where: { idProject: idProject }, raw: true }
      );
      return response.accepted(res, "Update project success", updatedProject);
    } catch (e) {
      console.log(e);
      return response.error(res, "Update project fail", e);
    }
  },
  removeProject: async (req, res, next) => {
    const { user } = req;
    const { idProject } = req.body;
    try {
      await transactions.removeProject(idProject, user.idUser);
      return response.success(res, "Remove project success");
    } catch (e) {
      console.log(e);
      return response.error(res, "Remove project fail", e);
    }
  },
  addMembers: async (req, res, next) => {
    let { user } = req;
    let { idProject, members } = req.body;
    try {
      await transactions.addMembers(idProject, members, user.idUser);
      return response.created(res, "Add project's member success");
    } catch (e) {
      console.log(e);
      return response.error(res, "Add project's member fail", e);
    }
  },
  removeMembers: async (req, res, next) => {
    let { user } = req;
    let { idProject, members } = req.body;
    try {
      await transactions.removeMembers(idProject, members, user.idUser);
      return response.success(res, "Remove project's member success");
    } catch (e) {
      console.log(e);
      return response.error(res, "Add project's member success", e);
    }
  }
};
