"use strict";
const response = require("../../utils/Responses");
const { ProjectModel, ProjectUserModel } = require("../../models");

module.exports = {
  createProject: async (req, res, next) => {
    let { user } = req;
    let { name, description, priority } = req.body;
    try {
      if (!user) throw "User not found";
      const newProject = await ProjectModel.create({
        name,
        short_name: name,
        creator: user.id_user,
        description,
        state: 2,
        priority
      });
      await ProjectUserModel.create({
        id_user: user.id_user,
        id_role: 2,
        id_project: newProject.id_project
      });
      console.log(newProject);

      return response.created(res, "Create project success");
    } catch (e) {
      console.log(e);
      return response.error(res, "Create project fail", e);
    }
  }
};
