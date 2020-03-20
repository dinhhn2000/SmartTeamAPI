"use strict";
const response = require("../../utils/Responses");
const {
  ProjectModel,
  ProjectUserModel,
  TeamUserModel,
  UserModel
} = require("../../models");
const helpers = require("../../utils/Helpers");
const validator = require("../../utils/Authentication/validations");

module.exports = {
  getProjectList: async (req, res, next) => {
    try {
      let { user } = req;
      let projectUserRecords = await ProjectUserModel.findAll({
        where: {
          id_user: user.id_user
        }
      });
      if (!projectUserRecords) throw "This project is not exist";
      let projectListIndex = projectUserRecords.map(record => {
        return record.dataValues.id_project;
      });
      let projectList = [];
      for (let i = 0; i < projectListIndex.length; i++) {
        let team = await ProjectModel.findOne({
          where: {
            id_project: projectListIndex[i]
          }
        });
        projectList.push(team.dataValues);
      }
      return response.success(res, "Get list of projects success", projectList);
    } catch (e) {
      console.log(e);
      return response.error(res, "Get list of projects fail", e);
    }
  },
  getProjectMemberList: async (req, res, next) => {
    try {
      let { user } = req;
      let { projectId } = req.body;
      let projectUserRecords = await ProjectUserModel.findAll({
        where: {
          id_project: projectId
        }
      });
      if (projectUserRecords.length === 0) throw "This project is not exist";
      else
        projectUserRecords = projectUserRecords.map(record => {
          return record.dataValues;
        });
      let isInProject = false;
      let memberList = [];
      for (let i = 0; i < projectUserRecords.length; i++) {
        if (projectUserRecords[i].id_user === user.id_user) isInProject = true;
        let memberInfo = await UserModel.findOne({
          where: { id_user: projectUserRecords[i].id_user }
        });
        memberList.push(memberInfo.dataValues);
      }
      if (isInProject)
        return response.success(res, "Get list of members success", memberList);
      else throw "This account is not in this project";
    } catch (e) {
      console.log(e);
      return response.error(res, "Get list of projects fail", e);
    }
  },
  createProject: async (req, res, next) => {
    let { user } = req;
    let { name, description, priority, teamId, finishedAt } = req.body;
    try {
      if (!user) throw "User not found";
      validator.validateProjectInfoType(name, priority, teamId, finishedAt);
      finishedAt = validator.convertDateToDATE(finishedAt, "finishedAt");
      if (new Date(finishedAt) < new Date())
        throw "finishedAt field is happened before now";
      if (typeof description === "undefined") description = null;
      const newProject = await ProjectModel.create({
        name,
        short_name: helpers.shortenNameHelper(name),
        creator: parseInt(teamId),
        description,
        state: 2,
        priority: parseInt(priority),
        finishedAt
      });
      await ProjectUserModel.create({
        id_user: user.id_user,
        id_role: 2,
        id_project: newProject.id_project
      });
      return response.created(
        res,
        "Create project success",
        newProject.dataValues
      );
    } catch (e) {
      console.log(e);
      return response.error(res, "Create project fail", e);
    }
  },
  updateProject: async (req, res, next) => {
    let { user } = req;
    let {
      projectId,
      name,
      description,
      priority,
      finishedAt,
      state
    } = req.body;
    try {
      if (!user) throw "User not found";
      if (typeof projectId === "undefined") throw "Missing projectId field";
      if (parseInt(projectId) === NaN) throw "projectId field must be integer";
      let projectRecord = await ProjectModel.findOne({
        where: {
          id_project: projectId
        }
      });
      if (!projectRecord) throw "This project not exist";
      else projectRecord = projectRecord.dataValues;
      if (typeof name === "undefined") name = projectRecord.name;
      if (typeof priority === "undefined") priority = projectRecord.priority;
      if (typeof state === "undefined") state = projectRecord.state;
      if (typeof finishedAt === "undefined")
        finishedAt = projectRecord.finishedAt;
      finishedAt = validator.convertDateToDATE(finishedAt, "finishedAt");
      if (new Date(finishedAt) < new Date())
        throw "finishedAt field is happened before now";
      if (typeof description === "undefined") description = null;

      const updatedProject = await ProjectModel.update(
        {
          name,
          short_name: helpers.shortenNameHelper(name),
          description,
          state: parseInt(state),
          priority: parseInt(priority),
          finishedAt
        },
        { where: { id_project: projectId } }
      );
      return response.accepted(
        res,
        "Update project success",
        updatedProject.dataValues
      );
    } catch (e) {
      console.log(e);
      return response.error(res, "Update project fail", e);
    }
  },
  addMembers: async (req, res, next) => {
    let { user } = req;
    let { projectId, members } = req.body;
    try {
      let projectRecord = await ProjectModel.findOne({
        where: {
          id_project: projectId
        }
      });
      if (!projectRecord) throw "Project not exist";
      else projectRecord = projectRecord.dataValues;
      let projectUserRecord = await ProjectUserModel.findOne({
        where: {
          id_project: projectId,
          id_user: user.id_user,
          id_role: 2
        }
      });
      if (!projectUserRecord) throw "This account is not admin in this project";
      else projectUserRecord = projectUserRecord.dataValues;

      for (let i = 0; i < members.length; i++) {
        let memberRecord = await TeamUserModel.findOne({
          where: {
            id_user: members[i],
            id_team: projectRecord.creator
          }
        });
        if (!memberRecord)
          throw `Member who has id=${members[i]} is not in the team`;
        else
          await ProjectUserModel.findOrCreate({
            where: { id_user: members[i], id_project: projectId },
            defaults: { id_role: 3 }
          });
      }
      return response.created(res, "Add project's member success");
    } catch (e) {
      console.log(e);
      return response.error(res, "Add project's member success", e);
    }
  }
};
