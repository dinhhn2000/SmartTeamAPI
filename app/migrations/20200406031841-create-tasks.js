"use strict";
const withInterval = require("sequelize-interval-postgres");

module.exports = {
  up: (queryInterface, Sequelize) => {
    const intervalSequelize = withInterval(Sequelize);

    return queryInterface.createTable("Tasks", {
      idTask: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      idProject: { allowNull: false, type: Sequelize.INTEGER },
      idUser: { allowNull: false, type: Sequelize.INTEGER },
      name: { allowNull: false, type: Sequelize.STRING },
      description: { type: Sequelize.STRING },
      startedAt: { allowNull: true, type: Sequelize.DATE },
      finishedAt: { allowNull: true, type: Sequelize.DATE },
      points: { allowNull: false, type: Sequelize.FLOAT },
      progress: { allowNull: false, type: Sequelize.FLOAT },
      type: { allowNull: false, type: Sequelize.INTEGER },
      state: { allowNull: false, type: Sequelize.INTEGER },
      workedTime: { allowNull: true, type: intervalSequelize.INTERVAL },
      remainTime: { allowNull: true, type: intervalSequelize.INTERVAL },
      duration: { allowNull: false, type: intervalSequelize.INTERVAL },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("Tasks");
  },
};
