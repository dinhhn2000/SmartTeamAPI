"use strict";
const { bcrypt, getSalt } = require("../utils/Encrypt");

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .createTable("Users", {
        idUser: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        firstName: { type: Sequelize.STRING, allowNull: false },
        lastName: { type: Sequelize.STRING, allowNull: false },
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
        is_verified: { type: Sequelize.BOOLEAN, defaultValue: false },
        updatedAt: { allowNull: false, type: Sequelize.DATE }
      })
      .then(async () => {
        try {
          let salt = await getSalt();
          bcrypt.hash("admin", salt, async (error, hash) => {
            queryInterface.bulkInsert("Users", [
              {
                idUser: 1,
                firstName: "admin",
                lastName: "admin",
                avatar: "",
                gender: "Not identify",
                email: "admin@gmail.com",
                password: hash,
                is_verified: true
              }
            ]);
          });
        } catch (e) {}
      })
      .then(() => {
        // perform further operations if needed
      });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("Users");
  }
};
