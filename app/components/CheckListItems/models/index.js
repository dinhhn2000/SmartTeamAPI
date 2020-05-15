"use strict";

const { DataTypes, Deferrable, Op } = require("sequelize");
const db = require("../../../utils/DB");

const CheckListItem = db.sequelize.define("CheckListItems", {
  idCheckListItem: {
    allowNull: false,
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  idCheckList: {
    allowNull: false,
    type: DataTypes.INTEGER,
    references: {
      model: "CheckLists",
      key: "idCheckList",
      deferrable: Deferrable.INITIALLY_DEFERRED,
    },
  },
  idUser: {
    allowNull: true,
    type: DataTypes.INTEGER,
    references: {
      model: "Users",
      key: "idUser",
      deferrable: Deferrable.INITIALLY_DEFERRED,
    },
  },
  content: { allowNull: false, type: DataTypes.STRING },
  finishedAt: { allowNull: true, type: DataTypes.DATE },
});

module.exports = CheckListItem;
