const { DataTypes } = require("sequelize");
const User_Role = require("./users_roles.model");
const db = require("../utils/DB/db");

const User = db.sequelize.define("Users", {
  id_user: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  first_name: { type: DataTypes.STRING },
  last_name: { type: DataTypes.STRING },
  avatar: { type: DataTypes.STRING, allowNull: true },
  dob: { type: DataTypes.DATE, allowNull: true },
  gender: {
    type: DataTypes.STRING,
    allowNull: true,
    vaidate: { isIn: [["Male", "Female", "Not identify"]] }
  },
  email: { type: DataTypes.STRING, allowNull: true },
  password: { type: DataTypes.STRING, allowNull: true },
  googleId: { type: DataTypes.STRING, allowNull: true },
  facebookId: { type: DataTypes.STRING, allowNull: true },
  is_verified: {type: DataTypes.BOOLEAN, defaultValue: false}
});

User.hasMany(User_Role);

User.sync().then(() => {
  // console.log("Users table created");
});

module.exports = User;
