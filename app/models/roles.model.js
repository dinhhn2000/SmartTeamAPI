const { DataTypes } = require("sequelize");
const User_Role = require("./users_roles.model");
const db = require("../utils/DB/db");

const Role = db.sequelize.define("Roles", {
  id_role: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: { type: DataTypes.STRING }
});

Role.sync().then(async () => {
  try {
    await Role.findOrCreate({
      where: { id_role: 1 },
      default: { name: "Super Admin" }
    });
  } catch (e) {
    console.log(e);
  }
  // console.log("Roles table created");
});
module.exports = Role;
