"use strict";
module.exports = {
  associate: () => {
    // TeamUserModel.belongsTo(TeamModel, { foreignKey: "idTeam" });
    // TeamUserModel.belongsTo(UserModel, { foreignKey: "idUser" });
    // TeamModel.hasMany(TeamUserModel, { foreignKey: "idTeam", as: "" });
    // UserModel.hasMany(TeamUserModel, { foreignKey: "idUser", as: "" });
  },
  // Original models
  OtpModel: require("../../components/Otps/models"),
  PriorityModel: require("../../components/Priorities/models"),
  ProjectUserModel: require("../../components/ProjectUser/models"),
  ProjectModel: require("../../components/Projects/models").Project,
  RoleModel: require("../../components/Roles/models"),
  StateModel: require("../../components/States/models"),
  TeamUserModel: require("../../components/TeamUser/models"),
  TeamModel: require("../../components/Teams/models").Team,
  UserModel: require("../../components/Users/models").User,
  TaskModel: require("../../components/Tasks/models").Task,
  TaskTypeModel: require("../../components/TaskType/models"),
  MilestoneModel: require("../../components/Milestones/models").Milestone,

  // Helpers for models
  ProjectModelHelpers: require("../../components/Projects/models"),
  TeamModelHelpers: require("../../components/Teams/models"),
  TaskModelHelpers: require("../../components/Tasks/models"),
  MilestoneModelHelpers: require("../../components/Milestones/models"),
  UserModelHelpers: require("../../components/Users/models"),

  // Some format in models
  excludeFieldsForUserInfo: require("../../components/Users/models")
    .excludeFieldsForUserInfo,
};
