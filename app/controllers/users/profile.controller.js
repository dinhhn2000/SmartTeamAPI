const UserModel = require("../../models/users.model");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const { bcrypt, getSalt } = require("../../utils/Encrypt/bcrypt");
const { JWT_SECRET, expireTime } = require("../constants");

function validateEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

function validatePassword(password) {
  var re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
  return re.test(String(password));
}

getToken = user => {
  let data = {
    firstName: user.first_name,
    lastName: user.last_name,
    avatar: user.avatar,
    email: user.email,
    googleId: user.googleId,
    facebookId: user.facebookId
  };

  const token = jwt.sign(data, JWT_SECRET, {
    expiresIn: expireTime + "m"
  });

  return token;
};

module.exports = {
    
}