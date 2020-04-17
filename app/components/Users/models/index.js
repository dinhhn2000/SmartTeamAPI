"use strict";
const { DataTypes, Op } = require("sequelize");
const db = require("../../../utils/DB");
const helpers = require("../../../utils/Helpers");

const User = db.sequelize.define("Users", {
  idUser: { primaryKey: true, autoIncrement: true, type: DataTypes.INTEGER },
  firstName: { type: DataTypes.STRING, allowNull: false },
  lastName: { type: DataTypes.STRING, allowNull: false },
  avatar: { type: DataTypes.STRING, allowNull: true },
  dob: { type: DataTypes.DATE, allowNull: true },
  gender: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "Male",
    validate: {
      isIn: {
        args: [["Male", "Female", "Not identify"]],
        msg: "Must be Male or Female or Not identify",
      },
    },
  },
  email: { type: DataTypes.STRING, allowNull: true, unique: true },
  password: { type: DataTypes.STRING, allowNull: true },
  googleId: { type: DataTypes.STRING, allowNull: true },
  facebookId: { type: DataTypes.STRING, allowNull: true },
  is_verified: { type: DataTypes.BOOLEAN, defaultValue: false },
});

const excludeFieldsForUserInfo = [
  "email",
  "password",
  "gender",
  "dob",
  "googleId",
  "facebookId",
  "is_verified",
];

module.exports = {
  User,
  excludeFieldsForUserInfo,
  findByIdUserList: async (idList, query) => {
    const filter = {
      attributes: { exclude: excludeFieldsForUserInfo },
      where: { idUser: { [Op.in]: idList }, ...query },
    };

    let paginationQuery = helpers.paginationQuery(filter, query);
    if (paginationQuery.hasPagination)
      return helpers.listStructure(
        paginationQuery.pageIndex,
        await User.findAndCountAll(paginationQuery.query),
        "users"
      );
    else return User.findAll(paginationQuery.query);
  },
  findByEmailAndIdUserList: async (idList, email, query) => {
    const filter = {
      attributes: { exclude: excludeFieldsForUserInfo },
      where: { idUser: { [Op.in]: idList }, email: { [Op.substring]: email }, ...query },
    };

    let paginationQuery = helpers.paginationQuery(filter, query);
    if (paginationQuery.hasPagination)
      return helpers.listStructure(
        paginationQuery.pageIndex,
        await User.findAndCountAll(paginationQuery.query),
        "users"
      );
    else return User.findAll(paginationQuery.query);
  },
  findByNameAndIdUserList: async (idList, name, query) => {
    const filter = {
      attributes: { exclude: excludeFieldsForUserInfo },
      where: {
        idUser: { [Op.in]: idList },
        firstName: { [Op.substring]: name },
        lastName: { [Op.substring]: name },
        ...query,
      },
    };

    let paginationQuery = helpers.paginationQuery(filter, query);
    if (paginationQuery.hasPagination)
      return helpers.listStructure(
        paginationQuery.pageIndex,
        await User.findAndCountAll(paginationQuery.query),
        "users"
      );
    else return User.findAll(paginationQuery.query);
  },
};
