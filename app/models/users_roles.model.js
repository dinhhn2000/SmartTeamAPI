const { DataTypes } = require("sequelize");
const db = require("../utils/DB/db");

const User_Role = db.sequelize.define("User_Role", {
  id_user: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  id_role: {
    type: DataTypes.INTEGER,
    primaryKey: true
  }
});

User_Role.sync().then(() => {
  // console.log("User_Role table created");
});
module.exports = User_Role;
