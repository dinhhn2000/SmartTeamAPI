"use strict";

const { DataTypes, Deferrable, Op } = require("sequelize");
const db = require("../../../utils/DB");
const helpers = require("../../../utils/Helpers");

const MediaData = db.sequelize.define("MediaDatas", {
  idMediaData: {
    allowNull: false,
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  url: { allowNull: false, type: DataTypes.STRING },
  type: { allowNull: false, type: DataTypes.STRING },
  idTask: {
    allowNull: false,
    type: DataTypes.INTEGER,
    references: {
      model: "Tasks",
      key: "idTask",
      deferrable: Deferrable.INITIALLY_DEFERRED,
    },
  },
});

module.exports = MediaData;

module.exports.findByIdTask = async (idTask, query) => {
  const filter = { where: { idTask } };
  let paginationQuery = helpers.paginationQuery(filter, query);
  if (paginationQuery.hasPagination)
    return helpers.listStructure(
      paginationQuery.pageIndex,
      await MediaData.findAndCountAll(paginationQuery.query),
      "mediaDatas"
    );
  else return MediaData.findAll(paginationQuery.query);
};
