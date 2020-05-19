"use strict";
const response = require("../../../utils/Responses");
const models = require("../../../utils/Models");
const validators = require("../../../utils/Validations/validations");
const transactions = require("../transactions");

module.exports = {
  getCheckListList: async (req, res, next) => {
    let { user } = req;
    let idTask = req.query.id;
    try {
      if (idTask === undefined || idTask === "") throw "Required id (idTask)";
      validators.validatePagination(req.query);

      // Check is in project
      let taskInfo = await models.TaskModel.findOne({ where: { idTask }, raw: true });
      if (!taskInfo) throw "This task not exist";
      let isInProject = await models.ProjectUserModel.findOne({
        where: { idUser: user.idUser, idProject: taskInfo.idProject },
      });
      if (!isInProject) throw "This account is not in this project";

      let checkListList = await models.CheckListModel.findByIdTask(idTask, req.query);
      return response.success(res, "Get list of checkLists success", checkListList);
    } catch (e) {
      return response.error(res, "Get list of checkLists fail", e);
    }
  },
  createCheckList: async (req, res, next) => {
    let { user } = req;
    let { idTask } = req.body;
    // let { name, idTask } = req.body;
    try {
      validators.validateCheckListInfo(req.body);

      // Check admin
      await checkAdmin(idTask, user.idUser);

      // Create checkList
      const newCheckList = await models.CheckListModel.create(req.body);
      return response.created(res, "Create checkList success", newCheckList);
    } catch (e) {
      return response.error(res, "Create checkList fail", e);
    }
  },
  updateCheckList: async (req, res, next) => {
    let { user } = req;
    let { idCheckList } = req.body;
    // let { name, idCheckList, idTask } = req.body;
    try {
      validators.validateCheckListInfo(req.body);

      // Check checkList
      let checkListInfo = await models.CheckListModel.findOne({
        where: { idCheckList },
        raw: true,
      });
      if (!checkListInfo) throw "This checkList is not existed";

      // Check admin
      await checkAdmin(checkListInfo.idTask, user.idUser);

      // Update checkList
      await models.CheckListModel.update(req.body, {
        where: { idCheckList },
        raw: true,
      });
      return response.accepted(res, "Update checkList success");
    } catch (e) {
      return response.error(res, "Update checkList fail", e);
    }
  },
  removeCheckList: async (req, res, next) => {
    const { user } = req;
    const { idCheckList } = req.body;
    try {
      if (idCheckList === undefined || idCheckList === "") throw "Required idCheckList";

      // Check checkList
      let checkListInfo = await models.CheckListModel.findOne({
        where: { idCheckList },
        raw: true,
      });
      if (!checkListInfo) throw "This checkList not exist";

      // Check admin
      checkAdmin(checkListInfo.idTask, user.idUser);

      await transactions.removeCheckList(idCheckList, user.idUser);
      return response.success(res, "Remove checkList success");
    } catch (e) {
      return response.error(res, "Remove checkList fail", e);
    }
  },
};

// Some helpers
async function checkAdmin(idTask, idUser) {
  let taskInfo = await models.TaskModel.findOne({ where: { idTask }, raw: true });
  if (!taskInfo) throw "This task is not existed";
  let isAdmin = await models.ProjectUserModel.findOne({
    where: { idUser, idRole: 2, idProject: taskInfo.idProject },
  });
  if (!isAdmin) throw "This account is not the admin in this project";
}
