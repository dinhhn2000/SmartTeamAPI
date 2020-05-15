"use strict";
const { DataTypes, Op } = require("sequelize");
const db = require("../../../utils/DB");
const helpers = require("../../../utils/Helpers");
const models = require("../../../utils/Models");

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

module.exports = User;
module.exports.findByIdUserList = async (idList, query) => {
  const filter = {
    attributes: { exclude: models.excludeFieldsForUserInfo },
    where: { idUser: { [Op.in]: idList } },
    raw: true,
  };

  let paginationQuery = helpers.paginationQuery(filter, query);
  if (paginationQuery.hasPagination)
    return helpers.listStructure(
      paginationQuery.pageIndex,
      await User.findAndCountAll(paginationQuery.query),
      "users"
    );
  else return User.findAll(paginationQuery.query);
};
module.exports.findByEmailAndIdUserList = async (idList, email, query) => {
  const filter = {
    attributes: { exclude: excludeFieldsForUserInfo },
    where: { idUser: { [Op.in]: idList }, email: { [Op.substring]: email } },
  };

  let paginationQuery = helpers.paginationQuery(filter, query);
  if (paginationQuery.hasPagination)
    return helpers.listStructure(
      paginationQuery.pageIndex,
      await User.findAndCountAll(paginationQuery.query),
      "users"
    );
  else return User.findAll(paginationQuery.query);
};
module.exports.findByNameAndIdUserList = async (idList, name, query) => {
  const filter = {
    attributes: { exclude: excludeFieldsForUserInfo },
    where: {
      idUser: { [Op.in]: idList },
      firstName: { [Op.substring]: name },
      lastName: { [Op.substring]: name },
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
};
