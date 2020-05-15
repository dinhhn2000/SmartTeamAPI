"use strict";
const moment = require("moment");
const Validator = require("validatorjs");
const rules = require("./rules");

function firstError(errorObj) {
  return errorObj[Object.keys(errorObj)[0]][0];
}

function validateStartDateFinishDate(startDate, finishDate) {
  if (startDate !== undefined && finishDate !== undefined)
    if (new Date(startDate) > new Date(finishDate))
      throw "start day cannot happen after finish day";
}

Validator.register(
  "intervalFormat",
  function (value, requirement, attribute) {
    return value.match(/^([0-9]|[1-9][0-9])(:[0-5]?[0-9])$/);
  },
  "The :attribute has to be in format hh:mm"
);

Validator.register(
  "dateFormat",
  function (value, requirement, attribute) {
    return value.match(/^([0-9]{4})(-)(1[0-2]|0[1-9])\2(3[01]|0[1-9]|[12][0-9])$/);
  },
  "The :attribute has to be in format YYYY-MM-DD"
);

module.exports = {
  customValidate: (input, inputName, ruleName) => {
    let validation = new Validator(
      { [inputName]: input },
      { [inputName]: rules.required[ruleName] }
    );
    if (validation.fails()) throw firstError(validation.errors.errors);
  },

  validateEmail: (email) => {
    let validation = new Validator({ email }, { email: rules.required.email });
    if (validation.fails()) throw firstError(validation.errors.errors);
  },

  validatePassword: (password) => {
    var re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
    if (!re.test(String(password)))
      throw "Password has to be at least 8 characters, contains at least 1 digit, 1 lower case, 1 upper case";
  },

  validateAccessToken: (access_token) => {
    let validation = new Validator({ access_token }, { access_token: rules.required.access_token });
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
        firstName: rules.non_required.firstName,
        lastName: rules.non_required.lastName,
        gender: rules.non_required.gender,
        email: rules.non_required.email,
        dob: rules.non_required.dob,
      }
    );
    if (validation.fails()) throw firstError(validation.errors.errors);
  },

  validateOtp: (otp) => {
    let validation = new Validator({ otp }, { otp: rules.required.otp });
    if (validation.fails()) throw firstError(validation.errors.errors);
  },

  validateOtpTime: (time) => {
    var now = moment(new Date()); //get now
    var end = moment(new Date(time)); // get create time
    var duration = moment.duration(now.diff(end));
    var minutes = duration.asMinutes();
    if (minutes > 5) throw "This OTP code is too old";
  },

  validateGender: (gender) => {
    let validation = new Validator({ gender }, { gender: rules.required.gender });
    if (validation.fails()) throw firstError(validation.errors.errors);
  },

  validateProjectInfo: (projectInfo) => {
    let { name, priority, idTeam, startedAt, finishedAt, description } = projectInfo;
    let validation = new Validator(
      { name, priority, idTeam, startedAt, finishedAt, description },
      {
        name: rules.required.name,
        description: rules.non_required.description,
        priority: rules.required.priority,
        idTeam: rules.required.idTeam,
        finishedAt: rules.non_required.date,
        startedAt: rules.required.date,
      }
    );
    if (validation.fails()) throw firstError(validation.errors.errors);
    validateStartDateFinishDate(startedAt, finishedAt);
  },

  validateUpdateProjectInfo: (projectInfo) => {
    let { idProject, name, description, priority, startedAt, finishedAt, state } = projectInfo;
    let validation = new Validator(
      { idProject, name, description, priority, startedAt, finishedAt, state },
      {
        name: rules.non_required.name,
        description: rules.non_required.description,
        priority: rules.non_required.priority,
        state: rules.non_required.state,
        startedAt: rules.non_required.date,
        finishedAt: rules.non_required.date,
        idProject: rules.required.id,
      }
    );
    if (validation.fails()) throw firstError(validation.errors.errors);
    validateStartDateFinishDate(startedAt, finishedAt);
  },

  validateHhMm: (input) => {
    var isValid = /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/.test(input);
    return isValid;
  },

  validateCheckListInfo: ({ name, idTask }) => {
    let validation = new Validator(
      { name, idTask },
      { name: rules.required.name, idTask: rules.required.id }
    );
    if (validation.fails()) throw firstError(validation.errors.errors);
  },

  validateTaskInfo: ({
    idProject,
    idMilestone,
    name,
    points,
    startedAt,
    finishedAt,
    type,
    duration,
    member,
  }) => {
    let validation = new Validator(
      {
        name,
        points,
        startedAt,
        finishedAt,
        type,
        duration,
        idProject,
        idMilestone,
        member,
      },
      {
        name: rules.required.name,
        description: rules.non_required.description,
        points: rules.required.points,
        startedAt: rules.non_required.date,
        finishedAt: rules.non_required.date,
        type: rules.required.type,
        duration: rules.required.duration,
        idProject: rules.required.id,
        idMilestone: rules.required.id,
        member: rules.non_required.member,
      }
    );
    if (validation.fails()) throw firstError(validation.errors.errors);
    validateStartDateFinishDate(startedAt, finishedAt);
  },

  validateUpdateTaskProgress: ({ idTask, workedTime, remainTime }) => {
    let validation = new Validator(
      { idTask, workedTime, remainTime },
      {
        idTask: rules.required.id,
        workedTime: rules.required.workedTime,
        remainTime: rules.required.remainTime,
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
    duration,
    workedTime,
    remainTime,
  }) => {
    let validation = new Validator(
      {
        idTask,
        name,
        points,
        startedAt,
        finishedAt,
        type,
        duration,
        description,
        workedTime,
        remainTime,
      },
      {
        idTask: rules.required.id,
        name: rules.non_required.name,
        description: rules.non_required.description,
        points: rules.non_required.points,
        startedAt: rules.non_required.date,
        finishedAt: rules.non_required.date,
        type: rules.non_required.type,
        duration: rules.non_required.duration,
        workedTime: rules.non_required.workedTime,
        remainTime: rules.non_required.remainTime,
      }
    );
    if (validation.fails()) throw firstError(validation.errors.errors);
    validateStartDateFinishDate(startedAt, finishedAt);
  },

  validateMilestoneInfo: ({ name, idProject, startedAt, finishedAt }) => {
    let validation = new Validator(
      { name, idProject, startedAt, finishedAt },
      {
        idProject: rules.required.id,
        name: rules.required.name,
        startedAt: rules.required.date,
        finishedAt: rules.required.date,
      }
    );
    if (validation.fails()) throw firstError(validation.errors.errors);
    validateStartDateFinishDate(startedAt, finishedAt);
  },

  validateUpdateMilestoneInfo: ({ idMilestone, name, startedAt, finishedAt }) => {
    let validation = new Validator(
      { name, idMilestone, startedAt, finishedAt },
      {
        idMilestone: rules.required.id,
        name: rules.non_required.name,
        startedAt: rules.non_required.date,
        finishedAt: rules.non_required.date,
      }
    );
    if (validation.fails()) throw firstError(validation.errors.errors);
    validateStartDateFinishDate(startedAt, finishedAt);
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
      { idProject: rules.required.id, members: rules.required.members }
    );
    if (validation.fails()) throw firstError(validation.errors.errors);
  },

  validateTaskMembers: (idTask, member) => {
    let validation = new Validator(
      { idTask, member },
      { idTask: rules.required.id, member: rules.required.member }
    );
    if (validation.fails()) throw firstError(validation.errors.errors);
  },

  validateId: (id) => {
    let validation = new Validator({ id }, { id: rules.required.id });
    if (validation.fails()) throw firstError(validation.errors.errors);
  },

  validateInterval: (time) => {
    let validation = new Validator({ time }, { time: "required|intervalFormat" });
    if (validation.fails()) throw firstError(validation.errors.errors);
  },

  validatePagination: ({ pageIndex, limit }) => {
    let validation = new Validator(
      { pageIndex, limit },
      { pageIndex: rules.non_required.pagination, limit: rules.non_required.pagination }
    );
    if (validation.fails()) throw firstError(validation.errors.errors);
  },

  validateStartFinish: (from, to) => {
    let validation = new Validator(
      { from, to },
      { from: rules.required.date, to: rules.required.date }
    );
    if (validation.fails()) throw firstError(validation.errors.errors);
    validateStartDateFinishDate(from, to);
  },
};
