"use strict";
const nodemailer = require("nodemailer");
require("dotenv").config();
const mail = process.env.EMAIL || "tutorreact@gmail.com";
const password = process.env.EMAIL_PASSWORD || "tvzjdbqpbhaclhna";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: mail,
    pass: password
  }
});

exports.createMessage = (email, otp, quote) => {
  return {
    to: email,
    subject: quote,
    html: `<p>This is your OTP code</p>
    <a style='background-color: #4CAF50;border: none;
    color: white;padding: 15px 32px;text-align: center;
    text-decoration: none;display: inline-block;
    font-size: 16px;margin: 4px 2px;cursor: pointer;
    border-radius: 5px;'>${otp}</a>`
  };
};

exports.sendEmail = async message => {
  try {
    await transporter.sendMail(message);
  } catch (e) {
    
    throw e;
  }
};
