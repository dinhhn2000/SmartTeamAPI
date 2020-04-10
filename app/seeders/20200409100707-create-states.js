"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("States", [
      { idState: 1, name: "Pending" },
      { idState: 2, name: "Open" },
      { idState: 3, name: "Work in progress" },
      { idState: 4, name: "Closed incompleted" },
      { idState: 5, name: "Closed completed" },
      { idState: 6, name: "Assigned" },
      { idState: 7, name: "Done" },
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("States", null, {});
  },
};
