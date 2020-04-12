"use strict";
const OtpModel = require("../../components/Otps/models");
const PriorityModel = require("../../components/Priorities/models");
const ProjectUserModel = require("../../components/ProjectUser/models");
const ProjectModel = require("../../components/Projects/models");
const RoleModel = require("../../components/Roles/models");
const StateModel = require("../../components/States/models");
const TeamUserModel = require("../../components/TeamUser/models");
const TeamModel = require("../../components/Teams/models");
const UserModel = require("../../components/Users/models");
const TaskModel = require("../../components/Tasks/models");
const TaskTypeModel = require("../../components/TaskType/models");
const MilestoneModel = require("../../components/Milestones/models");

module.exports = {
  associate: () => {
    // TeamUserModel.belongsTo(TeamModel, { foreignKey: "idTeam" });
    // TeamUserModel.belongsTo(UserModel, { foreignKey: "idUser" });
    // TeamModel.hasMany(TeamUserModel, { foreignKey: "idTeam", as: "" });
    // UserModel.hasMany(TeamUserModel, { foreignKey: "idUser", as: "" });
  },
  OtpModel,
  PriorityModel,
  ProjectUserModel,
  ProjectModel,
  RoleModel,
  StateModel,
  TeamUserModel,
  TeamModel,
  UserModel,
  TaskModel,
  TaskTypeModel,
  MilestoneModel,
  excludeFieldsForUserInfo: [
    "email",
    "password",
    "gender",
    "dob",
    "googleId",
    "facebookId",
    "is_verified",
  ],
};