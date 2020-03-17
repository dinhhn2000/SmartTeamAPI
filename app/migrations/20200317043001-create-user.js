"use strict";
const { bcrypt, getSalt } = require("../utils/Encrypt/bcrypt");

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .createTable("Users", {
        id_user: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        first_name: { type: Sequelize.STRING, allowNull: false },
        last_name: { type: Sequelize.STRING, allowNull: false },
        avatar: { type: Sequelize.STRING, allowNull: true },
        dob: { type: Sequelize.DATE, allowNull: true },
        gender: {
          type: Sequelize.STRING,
          allowNull: false,
          defaultValue: "Male",
          validate: {
            isIn: {
              args: [["Male", "Female", "Not identify"]],
              msg: "Must be English or Chinese"
            }
          }
        },
        email: { type: Sequelize.STRING, allowNull: true },
        password: { type: Sequelize.STRING, allowNull: true },
        googleId: { type: Sequelize.STRING, allowNull: true },
        facebookId: { type: Sequelize.STRING, allowNull: true },
        is_verified: { type: Sequelize.BOOLEAN, defaultValue: false }
      })
      .then(async () => {
        try {
          let salt = await getSalt();
          bcrypt.hash("admin", salt, async (error, hash) => {
            queryInterface.bulkInsert("Users", [
              {
                id_user: 1,
                first_name: "admin",
                last_name: "admin",
                avatar: "",
                gender: "Not identify",
                email: "admin@gmail.com",
                password: hash,
                is_verified: true
              }
            ]);
          });
        } catch (e) {
          console.log(e);
        }
      })
      .then(() => {
        // perform further operations if needed
      });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("Users");
  }
};
