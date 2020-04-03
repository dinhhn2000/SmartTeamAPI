"use strict";
const { DataTypes, Deferrable } = require("sequelize");
const db = require("../utils/DB");

const TeamUser = db.sequelize.define(
  "TeamUser",
  {
    idUser: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: "Users",
        key: "idUser",
        deferrable: Deferrable.INITIALLY_DEFERRED
      }
    },
    idTeam: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: "Teams",
        key: "idTeam",
        deferrable: Deferrable.INITIALLY_DEFERRED
      }
    },
    idRole: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Roles",
        key: "idRole",
        deferrable: Deferrable.INITIALLY_DEFERRED
      }
    }
  },
  { freezeTableName: true }
);

module.exports = TeamUser;
