'use strict';
module.exports = (sequelize, DataTypes) => {
  const Project_User = sequelize.define('Project_User', {
    id_project: DataTypes.INTEGER,
    id_user: DataTypes.INTEGER
  }, {});
  Project_User.associate = function(models) {
    // associations can be defined here
  };
  return Project_User;
};