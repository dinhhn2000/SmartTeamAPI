"use strict";
const { DataTypes, Deferrable, Op } = require("sequelize");
const db = require("../../../utils/DB");
const helpers = require("../../../utils/Helpers");
const TeamUserModel = require("../../TeamUser/models");

const Team = db.sequelize.define(
  "Teams",
  {
    idTeam: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    avatar: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    creator: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: "Users",
        key: "idUser",
        deferrable: Deferrable.INITIALLY_DEFERRED,
      },
    },
  },
  { indexes: [{ unique: true, fields: ["name", "creator"] }] }
);

module.exports = Team;
module.exports.findByIdTeamList = async (idList, query) => {
  const filter = { where: { idTeam: { [Op.in]: idList } }, raw: true };

  let paginationQuery = helpers.paginationQuery(filter, query);

  if (paginationQuery.hasPagination)
    return helpers.listStructure(
      paginationQuery.pageIndex,
      await Team.findAndCountAll(paginationQuery.query),
      "teams"
    );
  else return Team.findAll(paginationQuery.query);
};
