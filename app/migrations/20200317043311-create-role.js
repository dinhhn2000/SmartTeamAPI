"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .createTable("Roles", {
        id_role: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        name: { type: Sequelize.STRING }
      })
      .then(() => {
        queryInterface.bulkInsert("Roles", [
          {
            id_role: 1,
            name: "Super admin"
          },
          {
            id_role: 2,
            name: "Admin"
          },
          {
            id_role: 3,
            name: "Member"
          }
        ]);
      });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("Roles");
  }
};
