"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("Milestones", {
      idMilestone: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: { allowNull: false, type: Sequelize.STRING },
      idProject: { allowNull: false, type: Sequelize.INTEGER },
      startedAt: { allowNull: false, type: Sequelize.DATE },
      finishedAt: { allowNull: false, type: Sequelize.DATE },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("Milestones");
  },
};
