"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("Projects", {
      idProject: { autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      name: { type: Sequelize.STRING },
      short_name: { type: Sequelize.STRING, allowNull: false },
      idTeam: { type: Sequelize.INTEGER, allowNull: false },
      description: { type: Sequelize.STRING, allowNull: true },
      state: { type: Sequelize.INTEGER, allowNull: false },
      priority: { allowNull: false, type: Sequelize.INTEGER },
      startedAt: { allowNull: false, type: Sequelize.DATE },
      finishedAt: { allowNull: true, type: Sequelize.DATE },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("Projects");
  },
};
