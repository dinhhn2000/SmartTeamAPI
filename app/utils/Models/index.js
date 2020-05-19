"use strict";
module.exports = {
  associate: () => {
    // CheckList $ CheckListItems
    let CheckListModel = module.exports.CheckListModel;
    let CheckListItemModel = module.exports.CheckListItemModel;
    CheckListModel.hasMany(CheckListItemModel, { foreignKey: "idCheckList" });
    CheckListItemModel.belongsTo(CheckListModel, { foreignKey: "idCheckList" });

    // Teams & Role
    let TeamModel = module.exports.TeamModel;
    let TeamUserModel = module.exports.TeamUserModel;
    TeamModel.hasMany(TeamUserModel, { foreignKey: "idTeam" });
    TeamUserModel.belongsTo(TeamModel, { foreignKey: "idTeam" });
  },
  // Original models
  OtpModel: require("../../components/Otps/models"),
  PriorityModel: require("../../components/Priorities/models"),
  ProjectUserModel: require("../../components/ProjectUser/models"),
  ProjectModel: require("../../components/Projects/models"),
  RoleModel: require("../../components/Roles/models"),
  StateModel: require("../../components/States/models"),
  TeamUserModel: require("../../components/TeamUser/models"),
  TeamModel: require("../../components/Teams/models"),
  UserModel: require("../../components/Users/models"),
  TaskModel: require("../../components/Tasks/models"),
  TaskTypeModel: require("../../components/TaskType/models"),
  MilestoneModel: require("../../components/Milestones/models"),
  CheckListModel: require("../../components/CheckLists/models"),
  CheckListItemModel: require("../../components/CheckListItems/models"),

  // Some format in models
  excludeFieldsForUserInfo: [
    "email",
    "password",
    "gender",
    "dob",
    `"googleId"`,
    `"facebookId"`,
    "is_verified",
  ],
  includeFieldsForUserInfo: [
    `"idUser"`,
    `"firstName"`,
    `"lastName"`,
    "avatar",
    `"createdAt"`,
    `"updatedAt"`,
  ],

  // Raw queries
  sequelize: require("../DB").sequelize,
};
