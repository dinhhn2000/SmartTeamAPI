"use strict";
const { DataTypes, Deferrable } = require("sequelize");
const db = require("../utils/DB/db");

const Team_User = db.sequelize.define(
  "Team_User",
  {
    id_user: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: "Users",
        key: "id_user",
        deferrable: Deferrable.INITIALLY_DEFERRED
      }
    },
    id_team: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: "Teams",
        key: "id_team",
        deferrable: Deferrable.INITIALLY_DEFERRED
      }
    },
    id_role: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: "Roles",
        key: "id_role",
        deferrable: Deferrable.INITIALLY_DEFERRED
      }
    }
  },
  { freezeTableName: true }
);

// Team_User.sync().then(async () => {});
module.exports = Team_User;
