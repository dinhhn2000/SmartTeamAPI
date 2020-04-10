"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .createTable("Users", {
        idUser: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
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
              msg: "Must be Male or Female or Not identify",
            },
          },
        },
        email: { type: Sequelize.STRING, allowNull: true },
        password: { type: Sequelize.STRING, allowNull: true },
        googleId: { type: Sequelize.STRING, allowNull: true },
        facebookId: { type: Sequelize.STRING, allowNull: true },
        is_verified: { type: Sequelize.BOOLEAN, defaultValue: false },
        createdAt: { allowNull: false, type: Sequelize.DATE },
        updatedAt: { allowNull: false, type: Sequelize.DATE },
      })
      .then(() => {
        // perform further operations if needed
      });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("Users");
  },
};
