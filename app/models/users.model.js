"use strict";
const { DataTypes } = require("sequelize");
const db = require("../utils/DB/db");

const User = db.sequelize.define("Users", {
  id_user: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  first_name: { type: DataTypes.STRING, allowNull: false },
  last_name: { type: DataTypes.STRING, allowNull: false },
  avatar: { type: DataTypes.STRING, allowNull: true },
  dob: { type: DataTypes.DATE, allowNull: true },
  gender: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "Male",
    validate: {
      isIn: {
        args: [["Male", "Female", "Not identify"]],
        msg: "Must be English or Chinese"
      }
    }
  },
  email: { type: DataTypes.STRING, allowNull: true, unique: true },
  password: { type: DataTypes.STRING, allowNull: true },
  googleId: { type: DataTypes.STRING, allowNull: true },
  facebookId: { type: DataTypes.STRING, allowNull: true },
  is_verified: { type: DataTypes.BOOLEAN, defaultValue: false }
});

// User.sync().then(async () => {
//   // console.log("Users table created");
//   try {
//     let salt = await getSalt();
//     bcrypt.hash("admin", salt, async (error, hash) => {
//       if (!error) {
//         await User.findOrCreate({
//           where: { id_user: 1 },
//           defaults: {
//             first_name: "admin",
//             last_name: "admin",
//             avatar: "",
//             gender: "Not identify",
//             email: "admin@gmail.com",
//             password: hash,
//             is_verified: true
//           }
//         });
//       } else throw error;
//     });
//   } catch (e) {
//     console.log(e);
//   }
// });

module.exports = User;
