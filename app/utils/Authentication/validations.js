"use strict";
const moment = require("moment");
const validator = require("validator");

module.exports = {
  validateEmail: email => {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase()) && email.length > 0;
  },

  validatePassword: password => {
    var re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
    return re.test(String(password));
  },

  validateString: (arrayInput, fieldName) => {
    return arrayInput.map((input, index) => {
      if (input === undefined) return null;
      if (input.length === 0)
        throw `${fieldName[index]} is not in correct format`;
      return input;
    });
  },

  convertDateToDATE: (date, fieldName) => {
    if (new Date(parseInt(date)).getTime() !== parseInt(date))
      throw `${fieldName} is not in correct format, must be timestamp`;
    let checkDate = moment(new Date(parseInt(date)));
    if (checkDate.isValid()) {
      const result = moment(new Date(parseInt(date))).format(
        "YYYY-MM-DD HH:mm:ss"
      );
      return result;
    }
  },

  validateOtpTime: date => {
    var now = moment(new Date()); //get now
    var end = moment(new Date(date)); // get create time
    var duration = moment.duration(now.diff(end));
    var minutes = duration.asMinutes();
    if (minutes > 5) {
      throw "This OTP code is too old";
    }
    return true;
  },

  validateGender: gender => {
    if (gender != null)
      if (!validator.isIn(gender, ["Male", "Female", "Not identify"]))
        throw `gender must be 'Male', 'Female', 'Not identify'`;
  },

  validateProjectInfoType: (
    name,
    priority,
    teamId,
    finishedAt
  ) => {
    if (typeof name === "undefined") throw "Missing name field";
    if (typeof priority === "undefined") throw "Missing priority field";
    if (typeof teamId === "undefined") throw "Missing teamId field";
    if (typeof finishedAt === "undefined") throw "Missing finishedAt field";
    if (typeof name !== "string") throw "name field must be string";
    if (typeof priority === "integer") throw "priority field must be integer";
    if (typeof teamId === "integer") throw "teamId field must be integer";
  }
};
