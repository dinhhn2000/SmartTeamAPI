"use strict";
const nodemailer = require("nodemailer");
require("dotenv").config();
const mail = process.env.EMAIL || "tutorreact@gmail.com";
const password = process.env.EMAIL_PASSWORD || "tvzjdbqpbhaclhna";
const constants = require("../Constants");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: mail,
    pass: password,
  },
});

exports.createOtpEmail = (email, otp, quote) => {
  return {
    to: email,
    subject: quote,
    html: `<p>This is your OTP code</p>
    <a style='background-color: #4CAF50;border: none;
    color: white;padding: 15px 32px;text-align: center;
    text-decoration: none;display: inline-block;
    font-size: 16px;margin: 4px 2px;cursor: pointer;
    border-radius: 5px;'>${otp}</a>`,
  };
};

exports.createAnnounceEmail = (email, type, data) => {
  let html = "";
  let subject = "";
  switch (type) {
    case constants.INVITED_TO_PROJECT: {
      html = `<p>You have been invited to project <b>${data.projectName}</b></p>`;
      subject = "Project's invitation announcement";
      break;
    }
    case constants.KICKED_OUT_PROJECT: {
      html = `<p>You have been kicked out from project <b>${data.projectName}</b></p>`;
      subject = "Project's denial announcement";
      break;
    }
    case constants.TASK_NEAR_DEADLINE: {
      html = `<p>You have some tasks which near due day</p></br>`;
      for (let i = 0; i < data.length; i++) {
        html += `<p>Task <b>${data[i].taskName}</b> should be finished at <b>${data[i].taskDueDay}</b></p></br>`;
      }
      subject = "Tasks' deadline warning announcement";
      break;
    }
    case constants.ASSIGNED_TO_TASK: {
      html = `<p>You have been assigned for task <b>${data.taskName}</b> in project <b>${data.projectName}</b></p>`;
      subject = "Task's assign announcement";
      break;
    }
    case constants.UPDATE_ASSIGNED_TASK: {
      html = `<p>Your task <b>${data.taskName}</b> has been updated, please check the task for more infomation</p>`;
      subject = "Task's update announcement";
      break;
    }
    case constants.ASSIGNED_TO_ANOTHER_PERSON: {
      html = `<p>The task <b>${data.taskName}</b> has been assigned to another member</p>`;
      subject = "Task has been assigned announcement";
      break;
    }
    case constants.TASK_UNASSIGNED: {
      html = `<p>The task <b>${data.taskName}</b> has been unassigned</p>`;
      subject = "Task's unassigned announcement";
      break;
    }
    case constants.TASK_COMPLETE: {
      html = `<p>The task <b>${data.taskName}</b> has been finished</p>`;
      subject = "Task's complete announcement";
      break;
    }
    case constants.TASK_OVERDUE: {
      for (let i = 0; i < data.length; i++) {
        html = `<p>The task <b>${data[i].taskName}</b> has been overdue, please check the task to have some appropriate solutions</p>`;
      }
      subject = "Task's overdue announcement";
      break;
    }
    default: {
      html = `<p>Empty content</p>`;
      subject = "Empty subject";
    }
  }

  return {
    to: email,
    subject,
    html,
  };
};

exports.sendEmail = async (message) => {
  try {
    await transporter.sendMail(message);
  } catch (e) {
    throw e;
  }
};
