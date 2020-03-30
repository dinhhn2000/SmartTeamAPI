"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .createTable("Roles", {
        idRole: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        name: { type: Sequelize.STRING }
      })
      .then(() => {
        queryInterface.bulkInsert("Roles", [
          { idRole: 1, name: "Super admin" },
          { idRole: 2, name: "Admin" },
          { idRole: 3, name: "Member" }
        ]);
      });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("Roles");
  }
};
