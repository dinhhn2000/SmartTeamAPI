"use strict";
const { DataTypes, Deferrable } = require("sequelize");
const db = require("../utils/DB");

const Team = db.sequelize.define(
  "Teams",
  {
    idTeam: {
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
        key: "idUser",
        deferrable: Deferrable.INITIALLY_DEFERRED
      }
    }
  },
  { indexes: [{ unique: true, fields: ["name", "creator"] }] }
);

module.exports = Team;
