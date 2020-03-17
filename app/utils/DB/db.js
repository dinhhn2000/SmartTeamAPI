"use strict";
const Sequelize = require("sequelize");
const sequelize = new Sequelize("smartteam", "postgres", "123456", {
  host: "localhost",
  dialect: "postgres",
  logging: false,
  define: {
    timestamps: false
  }
});
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
