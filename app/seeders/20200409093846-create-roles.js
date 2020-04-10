"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("Roles", [
      { idRole: 1, name: "Super admin" },
      { idRole: 2, name: "Admin" },
      { idRole: 3, name: "Member" },
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Roles", null, {});
  },
};
