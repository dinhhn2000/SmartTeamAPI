const { DataTypes } = require("sequelize");
const User = require("./users.model");
const db = require("../utils/DB/db");

const Otp = db.sequelize.define(
  "OTP",
  {
    id_user: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    otp: { type: DataTypes.INTEGER }
  },
  { timestamps: true, createdAt: true, updatedAt: false }
);

Otp.belongsTo(User);

Otp.sync().then(() => {
  // console.log("Users table created");
});

module.exports = User;
