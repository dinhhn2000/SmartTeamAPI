"use strict";
const models = require("../../../utils/Models");
const { Op } = require("sequelize");
const db = require("../../../utils/DB");

module.exports = {
  removeCheckList: async (idCheckList, idUser) => {
    return db.sequelize.transaction(async (t) => {
      try {
        await models.CheckListItemModel.destroy({ where: { idCheckList }, transaction: t });
        await models.CheckListModel.destroy({ where: { idCheckList }, transaction: t });
        return true;
      } catch (e) {
        // Database errors
        if (e.errors !== undefined) throw e.errors.map((error) => error.message);
        throw e;
      }
    });
  },
};
