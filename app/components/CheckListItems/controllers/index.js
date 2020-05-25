"use strict";
const response = require("../../../utils/Responses");
const models = require("../../../utils/Models");
const validators = require("../../../utils/Validations/validations");
const transactions = require("../transactions");

module.exports = {
  getCheckListItemList: async (req, res, next) => {
    let { user } = req;
    let idCheckList = req.query.id;
    try {
      if (idCheckList === undefined || idCheckList === "") throw "Required id (idCheckList)";
      validators.validatePagination(req.query);

      // Check is in project
      let checkListInfo = await models.CheckListModel.findOne({
        where: { idCheckList },
        raw: true,
      });
      if (!checkListInfo) throw "This check list not exist";
      let taskInfo = await models.TaskModel.findOne({
        where: { idTask: checkListInfo.idTask },
        raw: true,
      });
      if (!taskInfo) throw "This task not exist";
      let isInProject = await models.ProjectUserModel.findOne({
        where: { idUser: user.idUser, idProject: taskInfo.idProject },
      });
      if (!isInProject) throw "This account is not in this project";

      let checkListList = await models.CheckListItemModel.findByIdCheckList(idCheckList, req.query);
      return response.success(res, "Get list of checkLists success", checkListList);
    } catch (e) {
      return response.error(res, "Get list of checkLists fail", e);
    }
  },
  createCheckListItem: async (req, res, next) => {
    let { user } = req;
    let { idCheckList } = req.body;
    // let { content, idCheckList, finishedAt, idUser } = req.body;
    try {
      validators.validateCheckListItemInfo(req.body);
      await checkAdmin(idCheckList, user.idUser);

      // Create checkList
      const newCheckListItem = await models.CheckListItemModel.create(req.body);
      return response.created(res, "Create check list item success", newCheckListItem);
    } catch (e) {
      return response.error(res, "Create check list item fail", e);
    }
  },
  updateCheckListItem: async (req, res, next) => {
    let { user } = req;
    let { idCheckListItem } = req.body;
    // let { content, idCheckList, idCheckListItem, idUser } = req.body;
    try {
      validators.validateCheckListItemInfo(req.body);

      // Check checkList
      let checkListItemInfo = await models.CheckListItemModel.findOne({
        where: { idCheckListItem },
        raw: true,
      });
      if (!checkListItemInfo) throw "This check list item is not existed";

      // Check admin
      await checkAdmin(checkListItemInfo.idCheckList, user.idUser);

      // Update checkList
      await models.CheckListItemModel.update(req.body, { where: { idCheckListItem } });
      return response.accepted(res, "Update check list item success");
    } catch (e) {
      return response.error(res, "Update check list item fail", e);
    }
  },
  removeCheckListItem: async (req, res, next) => {
    const { user } = req;
    const { idCheckListItem } = req.body;
    try {
      if (idCheckListItem === undefined || idCheckListItem === "") throw "Required idCheckListItem";

      // Check checkList
      let checkListItemInfo = await models.CheckListItemModel.findOne({
        where: { idCheckListItem },
        raw: true,
      });
      if (!checkListItemInfo) throw "This checkList not exist";
      checkAdmin(checkListItemInfo.idCheckList, user.idUser);

      await models.CheckListItemModel.destroy({ where: { idCheckListItem } });
      return response.success(res, "Remove check list item success");
    } catch (e) {
      return response.error(res, "Remove check list item fail", e);
    }
  },
};

// Some helpers
async function checkAdmin(idCheckList, idUser) {
  let checkListInfo = await models.CheckListModel.findOne({ where: { idCheckList }, raw: true });
  if (!checkListInfo) throw "This check list is not existed";
  let taskInfo = await models.TaskModel.findOne({
    where: { idCheckList: checkListInfo.idCheckList },
    raw: true,
  });
  if (!taskInfo) throw "This task is not existed";
  let isAdmin = await models.ProjectUserModel.findOne({
    where: { idUser, idRole: 2, idProject: taskInfo.idProject },
  });
  if (!isAdmin) throw "This account is not the admin in this project";
}
