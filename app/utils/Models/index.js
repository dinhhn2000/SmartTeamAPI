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

const { bcrypt, getSalt } = require("../Encrypt");

module.exports = {
  sync: async () => {
    try {
      await UserModel.sync().then(async () => {
        // console.log("Users table created");
        try {
          let salt = await getSalt();
          bcrypt.hash("admin", salt, async (error, hash) => {
            if (!error) {
              let admin = await UserModel.findOne({ where: { idUser: 1 } });
              if (!admin)
                await UserModel.create({
                  firstName: "admin",
                  lastName: "admin",
                  avatar: null,
                  gender: "Not identify",
                  email: "admin@gmail.com",
                  password: hash,
                  is_verified: true
                });
            } else throw error;
          });
        } catch (e) {
          console.log(e);
        }
      });
      await RoleModel.sync().then(async () => {
        try {
          await RoleModel.findOrCreate({
            where: { idRole: 1 },
            defaults: { name: "Super Admin" }
          });
          await RoleModel.findOrCreate({
            where: { idRole: 2 },
            defaults: { name: "Admin" }
          });
          await RoleModel.findOrCreate({
            where: { idRole: 3 },
            defaults: { name: "Member" }
          });
        } catch (e) {
          console.log(e);
        }
      });
      await TeamModel.sync();
      await StateModel.sync().then(async () => {
        try {
          await StateModel.findOrCreate({
            where: { idState: 1 },
            defaults: { name: "Pending" }
          });
          await StateModel.findOrCreate({
            where: { idState: 2 },
            defaults: { name: "Open" }
          });
          await StateModel.findOrCreate({
            where: { idState: 3 },
            defaults: { name: "Work in progress" }
          });
          await StateModel.findOrCreate({
            where: { idState: 4 },
            defaults: { name: "Closed incompleted" }
          });
          await StateModel.findOrCreate({
            where: { idState: 5 },
            defaults: { name: "Closed completed" }
          });
          await StateModel.findOrCreate({
            where: { idState: 6 },
            defaults: { name: "Assigned" }
          });
          await StateModel.findOrCreate({
            where: { idState: 7 },
            defaults: { name: "Done" }
          });
        } catch (e) {
          console.log(e);
        }
        // console.log("States table created");
      });
      await PriorityModel.sync().then(async () => {
        try {
          await PriorityModel.findOrCreate({
            where: { idPriority: 1 },
            defaults: { name: "Low" }
          });
          await PriorityModel.findOrCreate({
            where: { idPriority: 2 },
            defaults: { name: "Normal" }
          });
          await PriorityModel.findOrCreate({
            where: { idPriority: 3 },
            defaults: { name: "Important" }
          });
          await PriorityModel.findOrCreate({
            where: { idPriority: 4 },
            defaults: { name: "Critical" }
          });
        } catch (e) {
          console.log(e);
        }
        // console.log("Prioritys table created");
      });
      await ProjectModel.sync();
      await ProjectUserModel.sync();
      await TeamUserModel.sync();
      await OtpModel.sync();
      await TaskTypeModel.sync().then(async () => {
        try {
          await TaskTypeModel.findOrCreate({
            where: { idType: 1 },
            defaults: { name: "Developing" }
          });
          await TaskTypeModel.findOrCreate({
            where: { idType: 2 },
            defaults: { name: "Testing" }
          });
          await TaskTypeModel.findOrCreate({
            where: { idType: 3 },
            defaults: { name: "Deployed" }
          });
        } catch (e) {
          console.log(e);
        }
      });
      await TaskModel.sync();
      await MilestoneModel.sync();
      await createUserData();
    } catch (e) {
      console.log(e);
    }
  },
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
    "is_verified"
  ]
};

const createUserData = async () => {
  // console.log("Users table created");
  try {
    let salt = await getSalt();
    bcrypt.hash("123456Aa", salt, async (error, hash) => {
      if (!error) {
        for (let i = 2; i < 6; i++) {
          let admin = await UserModel.findOne({ where: { idUser: i } });
          if (!admin)
            await UserModel.create({
              firstName: `admin${i}`,
              lastName: `admin${i}`,
              avatar: null,
              gender: "Not identify",
              email: `admin${i}@gmail.com`,
              password: hash,
              is_verified: true
            });
        }
      } else throw error;
    });
  } catch (e) {
    console.log(e);
  }
};
