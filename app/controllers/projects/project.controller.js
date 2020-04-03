"use strict";
const response = require("../../utils/Responses");
const models = require("../../models");
const transactions = require("./project.transaction");
const helpers = require("../../utils/Helpers");
const validators = require("../../utils/Validations/validations");
const { Op } = require("sequelize");

module.exports = {
  getProjectList: async (req, res, next) => {
    let { user } = req;
    try {
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
      return response.error(res, "Get list of projects fail", e);
    }
  },
  getProjectMemberList: async (req, res, next) => {
    let { user } = req;
    let { idProject } = req.body;
    try {
      if (idProject === undefined || idProject === "") throw "Required idProject";
      // Get projects' members id
      let membersId = await models.ProjectUserModel.findAll({
        attributes: ["idUser"],
        where: { idProject },
        raw: true
      });
      if (membersId.length === 0) throw "This project is not exist";

      // Check is in the project
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
      else
        throw `Something wrong when get project's members (Maybe some ghost project with 0 members)`;
    } catch (e) {
      return response.error(res, "Get list of projects fail", e);
    }
  },
  createProject: async (req, res, next) => {
    let { user } = req;
    let { idTeam, startedAt, finishedAt } = req.body;
    try {
      // Validate fields
      validators.validateProjectInfo(req.body);

      let teamRecord = await models.TeamModel.findOne({
        where: { idTeam },
        raw: true
      });
      if (!teamRecord) throw "Team not exist";

      let teamUserRecord = await models.TeamUserModel.findOne({
        where: { idTeam, idUser: user.idUser, idRole: 2 }
      });
      if (!teamUserRecord) throw "This account is not admin in this team";

      // Call create transaction
      // Add some properties to req.body
      req.body.short_name = helpers.shortenName(req.body.name);
      req.body.state = 2;
      let newProject = await transactions.createProject(req.body, user.idUser);
      return response.created(res, "Create project success", newProject);
    } catch (e) {
      console.log(e);

      return response.error(res, "Create project fail", e);
    }
  },
  updateProject: async (req, res, next) => {
    let { user } = req;
    let { idProject, name } = req.body;
    try {
      // Validation
      // if (!user) throw "User not found";
      validators.validateUpdateProjectInfo(req.body);
      if (name !== undefined) req.body.short_name = helpers.shortenName(name);

      let projectRecord = await models.ProjectModel.findOne({
        where: { idProject },
        raw: true
      });
      if (!projectRecord) throw "This project not exist";

      let teamUserRecord = await models.TeamUserModel.findOne({
        where: { idTeam: projectRecord.idTeam, idUser: user.idUser, idRole: 2 }
      });
      if (!teamUserRecord) throw "This account is not admin in this team";

      const updatedProject = await models.ProjectModel.update(req.body, {
        where: { idProject },
        raw: true
      });
      return response.accepted(res, "Update project success");
    } catch (e) {
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
      return response.error(res, "Remove project fail", e);
    }
  },
  addMembers: async (req, res, next) => {
    let { user } = req;
    let { idProject, members } = req.body;
    try {
      validators.validateProjectMembers(idProject, members);
      await transactions.addMembers(idProject, members, user.idUser);
      return response.created(res, "Add project's member success");
    } catch (e) {
      return response.error(res, "Add project's member fail", e);
    }
  },
  removeMembers: async (req, res, next) => {
    let { user } = req;
    let { idProject, members } = req.body;
    try {
      validators.validateProjectMembers(idProject, members);
      await transactions.removeMembers(idProject, members, user.idUser);
      return response.success(res, "Remove project's member success");
    } catch (e) {
      return response.error(res, "Add project's member success", e);
    }
  }
};
