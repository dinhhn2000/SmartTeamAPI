"use strict";
const { DataTypes, Deferrable } = require("sequelize");
const db = require("../utils/DB");

const Team = db.sequelize.define(
  "Teams",
  {
    id_team: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING
    },
    avatar: {
      allowNull: true,
      type: DataTypes.STRING
    },
    creator: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: "Users",
        key: "id_user",
        deferrable: Deferrable.INITIALLY_DEFERRED
      }
    }
  },
  { timestamps: true, createdAt: "createdAt", updatedAt: false }
);

// Team.sync().then(async () => {
//   // console.log("Teams table created");
// });

module.exports = Team;
