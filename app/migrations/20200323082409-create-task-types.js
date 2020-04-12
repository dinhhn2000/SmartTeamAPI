"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("TaskType", {
      idType: {
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: { allowNull: false, type: Sequelize.STRING },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("TaskType");
  },
};
