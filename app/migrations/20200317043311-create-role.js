"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("Roles", {
      idRole: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      name: { allowNull: false, type: Sequelize.STRING },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("Roles");
  },
};
