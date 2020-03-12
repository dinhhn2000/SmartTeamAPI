const { DataTypes } = require("sequelize");
const User_Role = require("./users_roles.model");
const db = require("../utils/DB/db");

const Role = db.sequelize.define("Roles", {
  id_role: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  name: { type: DataTypes.STRING }
});

Role.hasMany(User_Role);

Role.sync().then(() => {
  // console.log("Roles table created");
});
module.exports = Role;
