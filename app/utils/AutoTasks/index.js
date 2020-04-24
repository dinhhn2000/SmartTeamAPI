const CronJob = require("cron").CronJob;
const models = require("../Models");
const { Op } = require("sequelize");
const constants = require("../Constants");
const { createAnnounceEmail, sendEmail } = require("../Email");

const sendWarningDueTaskEmail = async (idUser, data) => {
  let receiveUser = await models.UserModel.findOne({ where: { idUser }, raw: true });
  await sendEmail(createAnnounceEmail(receiveUser.email, constants.TASK_NEAR_DEADLINE, data));
};

const sendOverdueTaskEnail = async (idProject, data) => {
  // Get admins' email
  let receiveIdUserList = await models.ProjectUserModel.findAll({
    where: { idProject, idRole: 2 },
    raw: true,
  });
  receiveIdUserList = receiveIdUserList.map((e) => e.idUser);

  let receiveEmailList = await models.UserModel.findAll({
    attributes: ["email"],
    where: { idUser: { [Op.in]: receiveIdUserList }, email: { [Op.not]: null } },
    raw: true,
  });
  receiveEmailList = receiveEmailList.map((e) => e.email);
  await sendEmail(createAnnounceEmail(receiveEmailList, constants.TASK_OVERDUE, data));
};

module.exports = {
  autoSendWarningDueTaskEmail: async () => {
    var job = new CronJob(
      "0 9,14 * * 1-5", // At 9AM & 2PM weekdays
      // "* * * * *", // Debug every minute
      async () => {
        try {
          let taskList = await models.TaskModelHelpers.findNearDueDayTask(constants.DUE_DAYS_LIMIT);
          console.log(taskList);
          if (taskList.length === 0) return;

          let data = [];
          let currentIdUser = taskList[0].idUser;
          taskList.map(async (task, index) => {
            if (task.idUser !== currentIdUser) {
              sendWarningDueTaskEmail(currentIdUser, data);
              // Clear data and reset current user
              currentIdUser = task.idUser;
              data.length = 0;
            }
            data.push({ taskName: task.name, taskDueDay: task.finishedAt });
            if (index == taskList.length - 1) await sendWarningDueTaskEmail(currentIdUser, data);
          });
        } catch (e) {
          console.log(e);
        }
      },
      null,
      true,
      "Asia/Ho_Chi_Minh"
    );
    job.start();
  },
  autoSendOverdueTaskEmail: async () => {
    var job = new CronJob(
      "0 9 * * 1-5", // At 9AM weekdays
      // "* * * * *", // Debug every minute
      async () => {
        try {
          let taskList = await models.TaskModelHelpers.findOverdueTask(
            constants.OVERDUE_DAYS_LIMIT
          );
          console.log(taskList);
          if (taskList.length === 0) return;

          let data = [];
          let currentIdProject = taskList[0].idProject;
          taskList.map(async (task, index) => {
            if (task.idProject !== currentIdProject) {
              sendOverdueTaskEnail(currentIdProject, data);
              // Clear data and reset current user
              currentIdProject = task.idProject;
              data.length = 0;
            }
            data.push({ taskName: task.name });
            if (index == taskList.length - 1) await sendOverdueTaskEnail(currentIdProject, data);
          });
        } catch (e) {
          console.log(e);
        }
      },
      null,
      true,
      "Asia/Ho_Chi_Minh"
    );
    job.start();
  },
};
