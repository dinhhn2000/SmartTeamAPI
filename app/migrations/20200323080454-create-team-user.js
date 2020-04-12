"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("TeamUser", {
      idTeam: { primaryKey: true, type: Sequelize.INTEGER },
      idUser: { primaryKey: true, type: Sequelize.INTEGER },
      idRole: { allowNull: false, type: Sequelize.INTEGER },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("TeamUser");
  },
};
