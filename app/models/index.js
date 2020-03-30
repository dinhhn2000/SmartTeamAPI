"use strict";
const OtpModel = require("./otp.model");
const PriorityModel = require("./priorities.model");
const ProjectUserModel = require("./project_user.model");
const ProjectModel = require("./project.model");
const RoleModel = require("./roles.model");
const StateModel = require("./states.model");
const TeamUserModel = require("./team_user.model");
const TeamModel = require("./teams.model");
const UserModel = require("./users.model");
const TaskModel = require("./tasks.model");
const TaskTypeModel = require("./task_types.model");
const TaskUserModel = require("./task_user.model");

const { bcrypt, getSalt } = require("../utils/Encrypt");

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
          
        }
        // console.log("Roles table created");
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
        } catch (e) {
          
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
          
        }
      });
      await TaskModel.sync();
      await TaskUserModel.sync();
      await createUserData();
    } catch (e) {
      
    }
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
  TaskUserModel,
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
    
  }
};
