"use strict";
const response = require("../../../utils/Responses");
const models = require("../../../utils/Models");
const helpers = require("../../../utils/Helpers");
const validators = require("../../../utils/Validations/validations");
const constants = require("../../../utils/Constants");
const { createAnnounceEmail, sendEmail } = require("../../../utils/Email");
const { Op } = require("sequelize");

module.exports = {
  getProject: async (req, res, next) => {
    const idProject = req.query.id;
    if (idProject === undefined || idProject === "") throw "Required id (idProject)";
    let result = await models.ProjectModel.findOne({ where: { idProject }, raw: true });
    if (!result) throw "This project not exist";

    return response.success(res, "Get projects success", result);
  },
  getProjectList: async (req, res, next) => {
    const { user } = req;
    validators.validatePagination(req.query);

    // Get projects id
    let projectListIndex = await models.ProjectUserModel.findAll({
      attributes: ["idProject", "idRole"],
      where: { idUser: user.idUser },
      raw: true,
    });
    let idList = projectListIndex.map((e) => e.idProject);

    // Get projects info
    let projectList = await models.ProjectModel.findByIdProjectList(idList, req.query);
    let projects = projectList.projects !== undefined ? projectList.projects : projectList;
    projects = projects.map((project) => {
      let index = idList.indexOf(project.idProject);
      project.idRole = projectListIndex[index].idRole;
      return project;
    });

    return response.success(res, "Get list of projects success", projectList);
  },
  getProjectNotMemberList: async (req, res, next) => {
    const { user } = req;
    const idProject = req.query.id;
    if (idProject === undefined || idProject === "") throw "Required id (idProject)";
    validators.validatePagination(req.query);

    // Get idTeam
    let projectInfo = await models.ProjectModel.findOne({
      attributes: ["idTeam"],
      where: { idProject },
      raw: true,
    });
    if (!projectInfo) throw "This project is not exist";
    let { idTeam } = projectInfo;

    // // Get projects' members id
    // let memberInProject = await models.ProjectUserModel.findAll({
    //   attributes: ["idUser"],
    //   where: { idProject },
    //   raw: true,
    // });
    // memberInProject = memberInProject.map((e) => e.idUser);
    // if (!memberInProject.includes(user.idUser)) throw "This account is not in this project";

    // // Get all team's members
    // let memberInTeam = await models.TeamUserModel.findAll({
    //   attributes: ["idUser"],
    //   where: { idTeam },
    //   raw: true,
    // });
    // memberInTeam = memberInTeam.map((e) => e.idUser);
    // let memberNotInProject = memberInTeam.filter((id) => !memberInProject.includes(id));

    // // Get members' info
    // let membersInfo = await models.UserModel.findByIdUserList(memberNotInProject, req.query);

    let rawQuery = `SELECT ${models.includeFieldsForUserInfo} FROM "Users" u
    WHERE EXISTS
      (
        SELECT tu."idUser" 
        FROM "TeamUser" tu
        WHERE "idTeam" = ${idTeam} AND u."idUser" = tu."idUser"
      ) 
    AND NOT EXISTS 
      (
        SELECT pu."idUser"
        FROM "ProjectUser" pu
        WHERE pu."idProject" = ${idProject} AND u."idUser" = pu."idUser"
      )`;
    let membersInfo = await models.sequelize.query(rawQuery, {
      type: models.sequelize.QueryTypes.SELECT,
    });

    return response.success(res, "Get list of members success", membersInfo);
  },
  getProjectMemberList: async (req, res, next) => {
    const { user } = req;
    const idProject = req.query.id;
    if (idProject === undefined || idProject === "") throw "Required id (idProject)";
    validators.validatePagination(req.query);

    // Get projects' members id
    let membersId = await models.ProjectUserModel.findAll({
      attributes: ["idUser", "idRole"],
      where: { idProject },
      raw: true,
    });
    if (membersId.length === 0)
      throw "Something's wrong when getting project's members (Maybe some ghost projects with 0 members)";

    // Check is in the project
    let idList = membersId.map((e) => e.idUser);
    if (!idList.includes(user.idUser)) throw "This account is not in this project";

    // Get members' info
    let membersInfo = await models.UserModel.findByIdUserList(idList, req.query);
    let users = membersInfo.users !== undefined ? membersInfo.users : membersInfo;
    users = users.map((user) => {
      let index = idList.indexOf(user.idUser);
      user.idRole = membersId[index].idRole;
      return user;
    });

    return response.success(res, "Get list of members success", membersInfo);
  },
  getProjectProgress: async (req, res, next) => {
    const { user } = req;
    const idProject = req.query.id;
    if (idProject === undefined || idProject === "") throw "Required id (idProject)";

    await isProjectExist(idProject);
    await isInProject(idProject, user.idUser);

    // Get project's progress
    let tasks = await models.TaskModel.findAll({
      attributes: ["progress"],
      where: { idProject },
      raw: true,
    });
    if (tasks.length === 0)
      return response.success(res, "Get project's progress success", { progress: 0 });
    if (tasks.length === 1)
      return response.success(res, "Get project's progress success", {
        progress: tasks[0].progress,
      });

    tasks = tasks.map((task) => task.progress);
    let result = helpers.sumArray(tasks);
    return response.success(res, "Get project's progress success", {
      progress: result / tasks.length,
    });
  },
  getProjectWorkedTime: async (req, res, next) => {
    const { user } = req;
    const idProject = req.query.id;
    if (idProject === undefined || idProject === "") throw "Required id (idProject)";

    await isProjectExist(idProject);
    await isInProject(idProject, user.idUser);

    // Get project's progress
    let tasks = await models.TaskModel.findAll({
      attributes: ["workedTime", "duration"],
      where: { idProject },
      raw: true,
    });

    let totalWorkedTime = { hours: 0, minutes: 0 };
    let totalDuration = { hours: 0, minutes: 0 };

    tasks.forEach((task, index) => {
      totalWorkedTime.hours = totalWorkedTime.hours + tasks[0].workedTime.hours;
      totalWorkedTime.minutes = totalWorkedTime.minutes + tasks[0].workedTime.minutes;
      totalDuration.hours = totalDuration.hours + tasks[0].duration.hours;
      totalDuration.minutes = totalDuration.minutes + tasks[0].duration.minutes;
    });
    return response.success(res, "Get project's progress success", {
      totalWorkedTime,
      totalDuration,
    });
  },
  createProject: async (req, res, next) => {
    const { user } = req;
    const { idTeam } = req.body;
    const transaction = await models.sequelize.transaction();

    validators.validateProjectInfo(req.body);

    let teamRecord = await models.TeamModel.findOne({ where: { idTeam } });
    if (!teamRecord) throw "Team not exist";

    await isAdminInTeam(idTeam, user.idUser);

    req.body.short_name = helpers.shortenName(req.body.name);
    req.body.state = 2;
    let newProject = await models.ProjectModel.create(req.body, { transaction });
    await models.ProjectUserModel.create(
      { idUser: user.idUser, idRole: 2, idProject: newProject.idProject },
      { transaction }
    );
    await transaction.commit();
    return response.created(res, "Create project success", newProject);
  },
  updateProject: async (req, res, next) => {
    let { user } = req;
    let { idProject, name } = req.body;
    // Validation
    validators.validateUpdateProjectInfo(req.body);
    if (name !== undefined) req.body.short_name = helpers.shortenName(name);

    await isProjectExist(idProject);
    await isAdminInProject(idProject, user.idUser);

    let result = await models.ProjectModel.update(req.body, {
      where: { idProject },
      returning: true,
    });

    return response.accepted(res, "Update project success", result[1][0]);
  },
  removeProject: async (req, res, next) => {
    const { user } = req;
    const { idProject } = req.body;
    const transaction = await models.sequelize.transaction();

    await isProjectExist(idProject);
    await isAdminInProject(idProject, user.idUser);

    await models.ProjectUserModel.destroy({ where: { idProject }, transaction });
    await models.ProjectModel.destroy({ where: { idProject }, transaction });
    await transaction.commit();

    return response.success(res, "Remove project success");
  },
  addMembers: async (req, res, next) => {
    const { user } = req;
    const { idProject, members } = req.body;
    const transaction = await models.sequelize.transaction();

    validators.validateProjectMembers(idProject, members);

    let projectRecord = await models.ProjectModel.findOne({ where: { idProject }, raw: true });
    if (!projectRecord) throw "Project not exist";

    await isAdminInProject(idProject, user.idUser);

    // Check if any member already in project
    let projectUserRecords = await models.ProjectUserModel.findAll({
      attributes: ["idUser"],
      where: { idProject, idUser: { [Op.in]: members } },
    });
    if (projectUserRecords.length > 0) throw "Some of the members are already in the project";

    // Check if all members are in the team
    let teamUserRecord = await models.TeamUserModel.findAll({
      attributes: ["idUser"],
      where: { idUser: { [Op.in]: members }, idTeam: projectRecord.idTeam },
    });
    if (teamUserRecord.length < members.length) throw `Some of the members are not in the team`;

    // Add member
    let data = members.map((member) => {
      return { idUser: member, idProject, idRole: 3 };
    });
    await models.ProjectUserModel.bulkCreate(data, { transaction });

    // Send email to every member
    let emailList = await models.UserModel.findAll({
      attributes: ["email"],
      where: { idUser: { [Op.in]: members }, email: { [Op.not]: null } },
      raw: true,
    });
    emailList = emailList.map((e) => e.email);
    let sendData = { projectName: projectRecord.name };
    await sendEmail(createAnnounceEmail(emailList, constants.INVITED_TO_PROJECT, sendData));
    await transaction.commit();

    return response.created(res, "Add project's member success");
  },
  addAdmins: async (req, res, next) => {
    const { user } = req;
    const { idProject, members } = req.body;
    const transaction = await models.sequelize.transaction();

    validators.validateProjectMembers(idProject, members);

    let projectRecord = await models.ProjectModel.findOne({ where: { idProject }, raw: true });
    if (!projectRecord) throw "Project not exist";

    await isAdminInProject(idProject, user.idUser);

    // Check all members are in project
    let memberInProject = await models.ProjectUserModel.findAll({
      where: { idProject, idUser: { [Op.in]: members } },
    });
    if (memberInProject < members.length) throw "Some members are not in this project";

    let result = await models.ProjectUserModel.update(
      { idRole: 2 },
      { where: { idUser: { [Op.in]: members } }, transaction }
    );

    // Send email to every member
    let emailList = await models.UserModel.findAll({
      attributes: ["email"],
      where: { idUser: { [Op.in]: members }, email: { [Op.not]: null } },
      raw: true,
    });
    emailList = emailList.map((e) => e.email);
    let sendData = { projectName: projectRecord.name };
    await sendEmail(createAnnounceEmail(emailList, constants.INVITED_TO_PROJECT, sendData));
    await transaction.commit();

    return response.created(res, "Add project's member success");
  },
  removeMembers: async (req, res, next) => {
    const { user } = req;
    const { idProject, members } = req.body;
    const transaction = await models.sequelize.transaction();

    validators.validateProjectMembers(idProject, members);

    let projectRecord = await models.ProjectModel.findOne({ where: { idProject }, raw: true });
    if (!projectRecord) throw "Project not exist";

    await isAdminInProject(idProject, user.idUser);

    if (members.includes(user.idUser)) members.splice(members.indexOf(user.idUser), 1);
    let result = await models.ProjectUserModel.destroy({
      where: { idUser: { [Op.in]: members } },
      transaction,
    });
    if (result === 0) throw "Non of these members are in this project";

    // Send email to every member
    let emailList = await models.UserModel.findAll({
      attributes: ["email"],
      where: { idUser: { [Op.in]: members }, email: { [Op.not]: null } },
      raw: true,
    });

    let sendData = { projectName: projectRecord.name };
    emailList = emailList.map((e) => e.email);
    await sendEmail(createAnnounceEmail(emailList, constants.KICKED_OUT_PROJECT, sendData));
    await transaction.commit();

    return response.success(res, "Remove project's member success");
  },
};

async function isAdminInTeam(idTeam, idUser) {
  let isAdmin = await models.TeamUserModel.findOne({ where: { idTeam, idUser, idRole: 2 } });
  if (!isAdmin) throw "This account is not admin in this team";
}

async function isAdminInProject(idProject, idUser) {
  let isAdmin = await models.ProjectUserModel.findOne({ where: { idProject, idUser, idRole: 2 } });
  if (!isAdmin) throw "This account is not admin in this project";
}

async function isProjectExist(idProject) {
  let projectRecord = await models.ProjectModel.findOne({ where: { idProject }, raw: true });
  if (!projectRecord) throw "This project not exist";
}

async function isInProject(idProject, idUser) {
  let projectRecord = await models.ProjectUserModel.findOne({ where: { idProject, idUser } });
  if (!projectRecord) throw "This account is not in this project";
}
