"use strict";
const constants = require("../Constants");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  constants.dbName,
  constants.dbUserName,
  constants.dbPassword,
  {
    host: constants.dbHost,
    dialect: constants.dbDialect,
    logging: false,
    define: {
      timestamps: false
    }
  }
);
var db = {};

async function authenticate() {
  try {
    await sequelize.authenticate();
    console.log("Connection to database has been established successfully.");
    return true;
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    return false;
  }
}

authenticate();
db.sequelize = sequelize;
db.Sequelize = Sequelize;
module.exports = db;
