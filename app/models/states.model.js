"use strict";
const { DataTypes } = require("sequelize");
const db = require("../utils/DB");

const State = db.sequelize.define("States", {
  id_state: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: { type: DataTypes.STRING }
});

// State.sync().then(async () => {
//   try {
//     await State.findOrCreate({
//       where: { id_state: 1 },
//       defaults: { name: "Pending" }
//     });
//     await State.findOrCreate({
//       where: { id_state: 2 },
//       defaults: { name: "Open" }
//     });
//     await State.findOrCreate({
//       where: { id_state: 3 },
//       defaults: { name: "Work in progress" }
//     });
//     await State.findOrCreate({
//       where: { id_state: 4 },
//       defaults: { name: "Closed incompleted" }
//     });
//     await State.findOrCreate({
//       where: { id_state: 5 },
//       defaults: { name: "Closed completed" }
//     });
//   } catch (e) {
//     console.log(e);
//   }
//   // console.log("States table created");
// });
module.exports = State;
