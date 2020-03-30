"use strict";
const moment = require("moment");
const Validator = require("validatorjs");
const rules = require("./rules");

function firstError(errorObj) {
  return errorObj[Object.keys(errorObj)[0]];
}

Validator.register(
  "intervalFormat",
  function(value, requirement, attribute) {
    return value.match(/^(2[0-3]|[01]?[0-9]):([0-5]?[0-9]):([0-5]?[0-9])$/);
  },
  "The :attribute has to be in format hh:mm:ss"
);

module.exports = {
  validateEmail: email => {
    let validation = new Validator({ email }, { email: rules.required.email });
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
      { access_token: rules.required.access_token }
    );
    if (validation.fails()) throw firstError(validation.errors.errors);
  },

  validateUserName: (firstName, lastName) => {
    let validation = new Validator(
      { firstName, lastName },
      { firstName: rules.required.firstName, lastName: rules.required.lastName }
    );
    if (validation.fails()) throw firstError(validation.errors.errors);
  },

  validateProfileInfo: ({ firstName, lastName, gender, email, dob }) => {
    let validation = new Validator(
      { firstName, lastName, gender, email, dob },
      {
        firstName: rules.required.firstName,
        lastName: rules.required.lastName,
        gender: rules.non_required.gender,
        email: rules.non_required.email,
        dob: rules.non_required.dob
      }
    );
    if (validation.fails()) throw firstError(validation.errors.errors);
  },

  validateOtp: otp => {
    let validation = new Validator({ otp }, { otp: rules.required.otp });
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
    let validation = new Validator({ gender }, { gender: rules.required.gender });
    if (validation.fails()) throw firstError(validation.errors.errors);
  },

  validateProjectInfo: ({ name, priority, idTeam, finishedAt, description }) => {
    let validation = new Validator(
      { name, priority, idTeam, finishedAt, description },
      {
        name: rules.required.name,
        description: rules.non_required.description,
        priority: rules.required.priority,
        idTeam: rules.required.idTeam,
        finishedAt: rules.required.finishedAt
      }
    );
    if (validation.fails()) throw firstError(validation.errors.errors);
  },

  validateUpdateProjectInfo: projectInfo => {
    let { idProject, name, description, priority, finishedAt, state } = projectInfo;
    let validation = new Validator(
      { idProject, name, description, priority, finishedAt, state },
      {
        name: rules.non_required.name,
        description: rules.non_required.description,
        priority: rules.non_required.priority,
        state: rules.non_required.state,
        finishedAt: rules.non_required.finishedAt,
        idProject: rules.required.idProject
      }
    );
    if (validation.fails()) throw firstError(validation.errors.errors);
  },

  validateHhMm: input => {
    var isValid = /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/.test(input);
    return isValid;
  },

  validateTaskInfo: ({
    idProject,
    name,
    points,
    startedAt,
    finishedAt,
    type,
    duration
  }) => {
    let validation = new Validator(
      { name, points, startedAt, finishedAt, type, duration, idProject },
      {
        name: rules.required.name,
        description: rules.non_required.description,
        points: rules.required.points,
        startedAt: rules.non_required.startedAt,
        finishedAt: rules.non_required.finishedAt,
        type: rules.required.type,
        duration: "required|intervalFormat",
        idProject: rules.required.idProject
      }
    );
    if (validation.fails()) throw firstError(validation.errors.errors);
  },

  validateUpdateTaskInfo: ({
    idTask,
    name,
    description,
    points,
    startedAt,
    finishedAt,
    type,
    duration
  }) => {
    let validation = new Validator(
      { idTask, name, points, startedAt, finishedAt, type, duration, description },
      {
        idTask: rules.required.idTask,
        name: rules.non_required.name,
        description: rules.non_required.description,
        points: rules.non_required.points,
        startedAt: rules.non_required.startedAt,
        finishedAt: rules.non_required.finishedAt,
        type: rules.non_required.type,
        duration: "intervalFormat"
      }
    );
    if (validation.fails()) throw firstError(validation.errors.errors);
  },

  isInFuture: (date, fieldName) => {
    if (new Date(date) <= new Date()) throw `${fieldName} field is happened before now`;
    // return true;
  },

  validateTeamMembers: (idTeam, members) => {
    let validation = new Validator(
      { idTeam, members },
      { idTeam: rules.required.idTeam, members: rules.required.members }
    );
    if (validation.fails()) throw firstError(validation.errors.errors);
  },

  validateProjectMembers: (idProject, members) => {
    let validation = new Validator(
      { idProject, members },
      { idProject: rules.required.idProject, members: rules.required.members }
    );
    if (validation.fails()) throw firstError(validation.errors.errors);
  },

  validateTaskMembers: (idTask, members) => {
    let validation = new Validator(
      { idTask, members },
      { idTask: rules.required.idTask, members: rules.required.members }
    );
    if (validation.fails()) throw firstError(validation.errors.errors);
  }
};
