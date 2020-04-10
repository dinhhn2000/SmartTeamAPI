'use strict';
module.exports = (sequelize, DataTypes) => {
  const Otp = sequelize.define('Otp', {
    idUser: DataTypes.INTEGER,
    otp: DataTypes.INTEGER,
    email: DataTypes.STRING,
    type: DataTypes.INTEGER
  }, {});
  Otp.associate = function(models) {
    // associations can be defined here
  };
  return Otp;
};