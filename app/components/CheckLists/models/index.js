"use strict";

const { DataTypes, Deferrable, Op } = require("sequelize");
const db = require("../../../utils/DB");
const helpers = require("../../../utils/Helpers");
const CheckListItem = require("../../CheckListItems/models");

const CheckList = db.sequelize.define("CheckLists", {
  idCheckList: {
    allowNull: false,
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  idTask: {
    allowNull: false,
    type: DataTypes.INTEGER,
    references: {
      model: "Tasks",
      key: "idTask",
      deferrable: Deferrable.INITIALLY_DEFERRED,
    },
  },
  name: { allowNull: false, type: DataTypes.STRING },
});

module.exports = CheckList;
module.exports.findByIdTask = async (idTask, query) => {
  const filter = {
    where: { idTask },
    include: CheckListItem,
  };

  let paginationQuery = helpers.paginationQuery(filter, query);
  return helpers.handlePaginationQueryReturn(paginationQuery, CheckList, "checkLists");
};
