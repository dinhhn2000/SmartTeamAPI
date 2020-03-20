"use strict";
const { DataTypes } = require("sequelize");
const db = require("../utils/DB");

const Priority = db.sequelize.define("Priorities", {
  id_priority: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: { type: DataTypes.STRING }
});

// Priority.sync().then(async () => {
//   try {
//     await Priority.findOrCreate({
//       where: { id_state: 1 },
//       defaults: { name: "Low" }
//     });
//     await Priority.findOrCreate({
//       where: { id_state: 2 },
//       defaults: { name: "Normal" }
//     });
//     await Priority.findOrCreate({
//       where: { id_state: 3 },
//       defaults: { name: "Important" }
//     });
//     await Priority.findOrCreate({
//       where: { id_state: 4 },
//       defaults: { name: "Critical" }
//     });
//   } catch (e) {
//     console.log(e);
//   }
//   // console.log("Prioritys table created");
// });
module.exports = Priority;
