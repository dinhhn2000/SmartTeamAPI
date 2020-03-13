const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "smartteam@gmail.com",
    pass: "tvzjdbqpbhaclhna"
  }
});

exports.sendEmail = async message => {
  let result;
  try {
    await transporter.sendMail(message);
  } catch (err) {
    console.log(err);
  }
};
