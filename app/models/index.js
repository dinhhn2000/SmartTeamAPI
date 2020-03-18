const OtpModel = require("./otp.model");
const PriorityModel = require("./priorities.model");
const ProjectUserModel = require("./project_user.model");
const ProjectModel = require("./project.model");
const RoleModel = require("./roles.model");
const StateModel = require("./states.model");
const TeamUserModel = require("./team_user.model");
const TeamModel = require("./teams.model");
const UserModel = require("./users.model");

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
              await UserModel.findOrCreate({
                where: { id_user: 1 },
                defaults: {
                  first_name: "admin",
                  last_name: "admin",
                  avatar: "",
                  gender: "Not identify",
                  email: "admin@gmail.com",
                  password: hash,
                  is_verified: true
                }
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
            where: { id_role: 1 },
            defaults: { name: "Super Admin" }
          });
          await RoleModel.findOrCreate({
            where: { id_role: 2 },
            defaults: { name: "Admin" }
          });
          await RoleModel.findOrCreate({
            where: { id_role: 3 },
            defaults: { name: "Member" }
          });
        } catch (e) {
          console.log(e);
        }
        // console.log("Roles table created");
      });
      await TeamModel.sync();
      await StateModel.sync().then(async () => {
        try {
          await StateModel.findOrCreate({
            where: { id_state: 1 },
            defaults: { name: "Pending" }
          });
          await StateModel.findOrCreate({
            where: { id_state: 2 },
            defaults: { name: "Open" }
          });
          await StateModel.findOrCreate({
            where: { id_state: 3 },
            defaults: { name: "Work in progress" }
          });
          await StateModel.findOrCreate({
            where: { id_state: 4 },
            defaults: { name: "Closed incompleted" }
          });
          await StateModel.findOrCreate({
            where: { id_state: 5 },
            defaults: { name: "Closed completed" }
          });
        } catch (e) {
          console.log(e);
        }
        // console.log("States table created");
      });
      await PriorityModel.sync().then(async () => {
        try {
          await PriorityModel.findOrCreate({
            where: { id_priority: 1 },
            defaults: { name: "Low" }
          });
          await PriorityModel.findOrCreate({
            where: { id_priority: 2 },
            defaults: { name: "Normal" }
          });
          await PriorityModel.findOrCreate({
            where: { id_priority: 3 },
            defaults: { name: "Important" }
          });
          await PriorityModel.findOrCreate({
            where: { id_priority: 4 },
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
    } catch (e) {
      console.log(e);
    }
  }
};
