const jwt = require("jsonwebtoken");
const moment = require("moment");

const UserModel = require("../../models/users.model");
const RoleModel = require("../../models/roles.model");
// const { bcrypt, getSalt } = require("../../utils/Encrypt/bcrypt");
const { JWT_SECRET, expireTime } = require("../constants");

function validateEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

function validatePassword(password) {
  var re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
  return re.test(String(password));
}

function validateString(arrayInput, fieldName) {
  return arrayInput.map((input, index) => {
    if (input === undefined) return null;
    if (input.length === 0) return null;
    return input;
  });
}

function validateDate(date, fieldName) {
  if (!moment.invalid(date)) {
    return moment(new Date(date)).format("X");
  }
  throw `${fieldName} is not in correct format`;
}

function getToken(user) {
  let data = {
    userId: user.id_user,
    firstName: user.first_name,
    lastName: user.last_name,
    avatar: user.avatar
  };

  const token = jwt.sign(data, JWT_SECRET, {
    expiresIn: expireTime + "m"
  });

  return token;
}

module.exports = {
  getProfile: async (req, res, next) => {
    let { user } = req;
    if (!user) {
      return res.status(400).json({
        message: req.message
      });
    }
    let profile = {
      firstName: user.first_name,
      lastName: user.last_name,
      avatar: user.avatar,
      email: user.email,
      gender: user.gender,
      dob: user.dob
    };
    res.status(200).json({
      profile
    });
  },
  updateProfile: async (req, res, next) => {
    try {
      let { user } = req;
      let { firstName, lastName, dob, gender } = req.body;
      [firstName, lastName, gender] = validateString(
        [firstName, lastName, gender],
        ["firstName", "lastName", "avatar", "gender"]
      );
      dob = validateDate(dob, "dob");
      await UserModel.update(
        {
          first_name: firstName === null ? user.first_name : firstName,
          last_name: lastName === null ? user.last_name : lastName,
          dob: dob === null ? user.dob : dob,
          gender: gender === null ? user.gender : gender
        },
        {
          where: {
            id_user: user.id_user
          }
        }
      );
      return res.json({ message: "Update profile success" });
    } catch (e) {
      // console.log(e);
      return res.status(400).json({
        message: "Something wrong when update profile",
        error: e
      });
    }
  }
};
