"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("Priorities", [
      { idPriority: 1, name: "Low" },
      { idPriority: 2, name: "Normal" },
      { idPriority: 3, name: "Important" },
      { idPriority: 4, name: "Critical" },
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Priorities", null, {});
  },
};
