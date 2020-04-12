"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("TaskType", [
      { idType: 1, name: "Developing" },
      { idType: 2, name: "Testing" },
      { idType: 3, name: "Deployed" },
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("TaskType", null, {});
  },
};
