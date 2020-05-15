"use strict";
const response = require("../../../utils/Responses");
const models = require("../../../utils/Models");
const helpers = require("../../../utils/Helpers");
const validators = require("../../../utils/Validations/validations");
const { Op } = require("sequelize");

module.exports = {
  searchProjectByTime: async (req, res, next) => {
    let { user } = req;
    let { from, to } = req.query;
    try {
      validators.validateStartFinish(from, to);
      validators.validatePagination(req.query);

      // Get all user's project
      let projectId = await models.ProjectUserModel.findAll({
        where: { idUser: user.idUser },
        raw: true,
      });
      if (projectId.length === 0) throw response.success(res, "This account is not in any project");
      projectId = projectId.map((id) => id.idProject);

      // Get all project in this period
      let projectList = await models.ProjectModel.findByTimeAndIdProjectList(
        projectId,
        from,
        to,
        req.query
      );

      return response.success(res, "Search success", projectList);
    } catch (e) {
      return response.error(res, "Search failed", e);
    }
  },
  searchTaskByTime: async (req, res, next) => {
    let { user } = req;
    let idProject = req.query.id;
    let { from, to } = req.query;
    try {
      validators.validateId(idProject);
      validators.validateStartFinish(from, to);
      validators.validatePagination(req.query);

      // Get all user's project
      let validMember = await models.ProjectUserModel.findOne({
        where: { idUser: user.idUser, idProject },
        raw: true,
      });
      if (!validMember) throw response.success(res, "This account is not in this project");

      // Get all task in this period
      let taskRecords = await models.TaskModel.findByTime(idProject, from, to, req.query);

      return response.success(res, "Search success", taskRecords);
    } catch (e) {
      return response.error(res, "Search failed", e);
    }
  },
  searchMilestoneByTime: async (req, res, next) => {
    let { user } = req;
    let idProject = req.query.id;
    let { from, to } = req.query;
    try {
      validators.validateId(idProject);
      validators.validateStartFinish(from, to);
      validators.validatePagination(req.query);

      // Get all user's project
      let validMember = await models.ProjectUserModel.findOne({
        where: { idUser: user.idUser, idProject },
        raw: true,
      });
      if (!validMember) throw response.success(res, "This account is not in this project");

      // Get all task in this period
      let milestoneRecords = await models.MilestoneModel.findByTime(
        idProject,
        from,
        to,
        req.query
      );

      return response.success(res, "Search success", milestoneRecords);
    } catch (e) {
      return response.error(res, "Search failed", e);
    }
  },
  searchProjectByPriority: async (req, res, next) => {
    let { user } = req;
    let { min, max } = req.query;
    try {
      validators.customValidate(min, "min", "priority");
      validators.customValidate(max, "max", "priority");
      if (from > to) throw "from cannot exceed to";

      // Get all user's project
      let projectId = await models.ProjectUserModel.findAll({
        where: { idUser: user.idUser },
        raw: true,
      });
      if (projectId.length === 0) throw response.success(res, "This account is not in any project");
      projectId = projectId.map((id) => id.idProject);

      // Get all project in this priority range
      let projectList = await models.ProjectModel.findByPriorityAndIdProjectList(
        projectId,
        min,
        max,
        req.query
      );

      return response.success(res, "Search success", projectList);
    } catch (e) {
      return response.error(res, "Search failed", e);
    }
  },
  searchProjectByDueDay: async (req, res, next) => {
    let { user } = req;
    let { from, to } = req.query;
    try {
      validators.validateStartFinish(from, to);
      validators.validatePagination(req.query);

      // Get all user's project
      let projectId = await models.ProjectUserModel.findAll({
        where: { idUser: user.idUser },
        raw: true,
      });
      if (projectId.length === 0) throw response.success(res, "This account is not in any project");
      projectId = projectId.map((id) => id.idProject);

      // Get all project in this priority range
      let projectList = await models.ProjectModel.findByDueDayAndIdProjectList(
        projectId,
        from,
        to,
        req.query
      );

      return response.success(res, "Search success", projectList);
    } catch (e) {
      return response.error(res, "Search failed", e);
    }
  },
  searchTaskByDueDay: async (req, res, next) => {
    let { user } = req;
    let idProject = req.query.id;
    let { from, to } = req.query;
    try {
      if (idProject === undefined || idProject === "") throw "Required id (idProject)";
      validators.validateStartFinish(from, to);
      validators.validatePagination(req.query);

      // Check is in project
      let isMember = await models.ProjectUserModel.findOne({
        where: { idUser: user.idUser, idProject },
        raw: true,
      });
      if (!isMember) throw "This account is not in this project";

      // Get all tasks in this due days range
      let taskList = await models.TaskModel.findByDueDayAndIdProject(
        idProject,
        from,
        to,
        req.query
      );

      return response.success(res, "Search success", taskList);
    } catch (e) {
      return response.error(res, "Search failed", e);
    }
  },
  searchTaskByMilestone: async (req, res, next) => {
    let { user } = req;
    let idMilestone = req.query.id;
    try {
      if (idMilestone === undefined || idMilestone === "") throw "Required id (idMilestone)";
      validators.validatePagination(req.query);

      // Check milestone
      let milestoneInfo = await models.MilestoneModel.findOne({
        where: { idMilestone },
        raw: true,
      });
      if (!milestoneInfo) throw "This milestone not exist";

      // Check is in project
      let isMember = await models.ProjectUserModel.findOne({
        where: { idUser: user.idUser, idProject: milestoneInfo.idProject },
        raw: true,
      });
      if (!isMember) throw "This account is not in this project";

      // Get all tasks in this due days range
      let taskList = await models.TaskModel.findByIdMilestone(idMilestone, req.query);

      return response.success(res, "Search success", taskList);
    } catch (e) {
      return response.error(res, "Search failed", e);
    }
  },
  searchMyTaskByMilestone: async (req, res, next) => {
    let { user } = req;
    let idMilestone = req.query.id;
    try {
      if (idMilestone === undefined || idMilestone === "") throw "Required id (idMilestone)";
      validators.validatePagination(req.query);

      // Check milestone
      let milestoneInfo = await models.MilestoneModel.findOne({
        where: { idMilestone },
        raw: true,
      });
      if (!milestoneInfo) throw "This milestone not exist";

      // Check is in project
      let isMember = await models.ProjectUserModel.findOne({
        where: { idUser: user.idUser, idProject: milestoneInfo.idProject },
        raw: true,
      });
      if (!isMember) throw "This account is not in this project";

      // Get all tasks in this due days range
      let taskList = await models.TaskModel.findByIdMilestone(
        idMilestone,
        user.idUser,
        req.query
      );

      return response.success(res, "Search success", taskList);
    } catch (e) {
      return response.error(res, "Search failed", e);
    }
  },
  searchUserByEmail: async (req, res, next) => {
    let { user } = req;
    let idTeam = req.query.id;
    let { email } = req.query;
    try {
      if (idTeam === undefined || idTeam === "") throw "Required id (idTeam)";
      // validators.validateEmail(email);
      validators.validatePagination(req.query);

      // Get all idUser in this team
      let members = await models.TeamUserModel.findAll({ where: { idTeam }, raw: true });
      if (members.length === 0) throw "This team not exist";
      members = members.map((e) => e.idUser);
      if (!members.includes(user.idUser)) throw "This account is not in this team";

      // Search user by email and idUser list
      let userList = await models.UserModel.findByEmailAndIdUserList(
        members,
        email,
        req.query
      );

      return response.success(res, "Search success", userList);
    } catch (e) {
      return response.error(res, "Search failed", e);
    }
  },
  searchUserByNameInTeam: async (req, res, next) => {
    let { user } = req;
    let idTeam = req.query.id;
    let { name } = req.query;
    try {
      if (idTeam === undefined || idTeam === "") throw "Required id (idTeam)";
      // validators.validateEmail(email);
      validators.validatePagination(req.query);

      // Get all idUser in this team
      let members = await models.TeamUserModel.findAll({ where: { idTeam }, raw: true });
      if (members.length === 0) throw "This team not exist";
      members = members.map((e) => e.idUser);
      if (!members.includes(user.idUser)) throw "This account is not in this team";

      // Search user by email and idUser list
      let userList = await models.UserModel.findByNameAndIdUserList(
        members,
        name,
        req.query
      );

      return response.success(res, "Search success", userList);
    } catch (e) {
      return response.error(res, "Search failed", e);
    }
  },
  searchUserByNameInProject: async (req, res, next) => {
    let { user } = req;
    let idProject = req.query.id;
    let { name } = req.query;
    try {
      if (idProject === undefined || idProject === "") throw "Required id (idProject)";
      // validators.validateEmail(email);
      validators.validatePagination(req.query);

      // Get all idUser in this team
      let members = await models.ProjectUserModel.findAll({ where: { idProject }, raw: true });
      if (members.length === 0) throw "This team not exist";
      members = members.map((e) => e.idUser);
      if (!members.includes(user.idUser)) throw "This account is not in this team";

      // Search user by email and idUser list
      let userList = await models.UserModel.findByNameAndIdUserList(
        members,
        name,
        req.query
      );

      return response.success(res, "Search success", userList);
    } catch (e) {
      return response.error(res, "Search failed", e);
    }
  },
};
