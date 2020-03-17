'use strict';
module.exports = (sequelize, DataTypes) => {
  const Projects = sequelize.define('Projects', {
    id_project: DataTypes.INTEGER,
    name: DataTypes.STRING
  }, {});
  Projects.associate = function(models) {
    // associations can be defined here
  };
  return Projects;
};