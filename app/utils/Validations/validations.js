"use strict";
const moment = require("moment");
const Validator = require("validatorjs");
const rules = require("./rules");

function firstError(errorObj) {
  return errorObj[Object.keys(errorObj)[0]];
}

module.exports = {
  validateEmail: email => {
    let validation = new Validator({ email }, { email: rules.email });
    if (validation.fails()) throw firstError(validation.errors.errors);
  },

  validatePassword: password => {
    var re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
    if (!re.test(String(password)))
      throw "Password has to be at least 8 characters, contains at least 1 digit, 1 lower case, 1 upper case";
  },

  validateAccessToken: access_token => {
    let validation = new Validator(
      { access_token },
      { access_token: rules.access_token }
    );
    if (validation.fails()) throw firstError(validation.errors.errors);
  },

  validateUserName: (firstName, lastName) => {
    let validation = new Validator(
      { firstName, lastName },
      { firstName: rules.firstName, lastName: rules.lastName }
    );
    if (validation.fails()) throw firstError(validation.errors.errors);
  },

  validateProfileInfo: ({ firstName, lastName, gender, email }) => {
    let validation = new Validator(
      { firstName, lastName, gender, email },
      {
        firstName: rules.firstName,
        lastName: rules.lastName,
        gender: rules.gender,
        email: rules.email
      }
    );
    if (validation.fails()) throw firstError(validation.errors.errors);
  },

  validateOtp: otp => {
    let validation = new Validator({ otp }, { otp: rules.otp });
    if (validation.fails()) throw firstError(validation.errors.errors);
  },

  validateOtpTime: time => {
    var now = moment(new Date()); //get now
    var end = moment(new Date(time)); // get create time
    var duration = moment.duration(now.diff(end));
    var minutes = duration.asMinutes();
    if (minutes > 5) throw "This OTP code is too old";
  },

  validateGender: gender => {
    let validation = new Validator({ gender }, { gender: rules.gender });
    if (validation.fails()) throw firstError(validation.errors.errors);
  },

  validateProjectInfo: ({ name, priority, idTeam, finishedAt }) => {
    let validation = new Validator(
      { name, priority, idTeam, finishedAt },
      {
        name: rules.name,
        priority: rules.priority,
        idTeam: rules.idTeam,
        finishedAt: rules.finishedAt
      }
    );
    if (validation.fails()) throw firstError(validation.errors.errors);
  },

  validateHhMm: inputField => {
    var isValid = /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/.test(
      inputField.value
    );
    return isValid;
  },

  validateTaskInfo: taskInfo => {
    let { name, points, finishedAt, type, duration, idProject } = taskInfo;
    let validation = new Validator(
      { name, points, finishedAt, type, duration, idProject },
      {
        name: rules.name,
        points: rules.points,
        finishedAt: rules.finishedAt,
        type: rules.type,
        duration: rules.duration,
        idProject: rules.idProject
      }
    );
    if (validation.fails()) throw firstError(validation.errors.errors);
    if (!validateHhMm(duration)) throw "duration field must have HH:MM format";
  },

  isInFuture: (date, fieldName) => {
    if (new Date(date) <= new Date()) throw `${fieldName} field is happened before now`;
    return true;
  }
};
