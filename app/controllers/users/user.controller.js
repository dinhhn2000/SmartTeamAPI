const passport = require("passport");
const jwt = require("jsonwebtoken");
const response = require("../../utils/Responses");

const {
  validateEmail,
  validatePassword,
  validateOtpTime
} = require("../../utils/Authentication/validations");
const { Op } = require("sequelize");

const UserModel = require("../../models/users.model");
const OtpModel = require("../../models/otp.model");
const { bcrypt, getSalt } = require("../../utils/Encrypt/bcrypt");
const { JWT_SECRET, expireTime } = require("../constants");
const { oauth, googleAuth } = require("../../utils/Authentication/googleOauth");
const { sendEmail, createMessage } = require("../../utils/Email/emailVerify");

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
  signUp: async (req, res, next) => {
    try {
      const { email, password, firstName, lastName } = req.body;
      if (!validateEmail(email)) {
        throw "Email is incorrect";
      }
      if (!validatePassword(password)) {
        throw "Password has to be at least 8 characters, contains at least 1 digit, 1 lower case, 1 upper case";
      }
      if (firstName.length === 0 || lastName.length === 0) {
        throw "User's name is incorrect";
      }

      // Check existed user
      let existedUser = await UserModel.findAll({
        where: {
          email
        }
      });

      if (existedUser.length !== 0) {
        throw `${email} has been used`;
      } else {
        let salt = await getSalt();
        bcrypt.hash(password, salt, async (error, hash) => {
          if (!error) {
            let user = await UserModel.create({
              first_name: firstName,
              last_name: lastName,
              email,
              password: hash,
              avatar: "https://icon-library.net/images/bot-icon/bot-icon-18.jpg"
            });
            // Send verify to email & create OTP
            const otp = Math.floor(Math.random() * 1000000 + 1);
            await OtpModel.create({
              id_user: user.dataValues.id_user,
              otp,
              type: 1,
              email: user.dataValues.email
            });
            const message = createMessage(email, otp, "Account verification");
            sendEmail(message);

            return response.created(res, "Sign up successful");
          }
        });
      }
    } catch (e) {
      console.log(e);
      return response.error(res, "Sign up failed", e);
    }
  },
  signIn: async (req, res, next) => {
    passport.authenticate(
      "local",
      {
        session: false
      },
      async (err, user, message) => {
        if (err || !user) {
          return response.error(res, message, err);
        }
        return response.success(res, "Sign in success", {
          expiresIn: expireTime * 60,
          accessToken: getToken(user)
        });
      }
    )(req, res, next);
  },
  signInGoogle: async (req, res, next) => {
    try {
      const { access_token } = req.body;
      if (!access_token) {
        throw "You should provide access_token";
      }
      const oauth2 = await oauth(access_token);
      oauth2.userinfo.get(async (err, oauthResponse) => {
        try {
          if (err) {
            throw "The access_token is incorrect";
          } else {
            const user = await googleAuth(oauthResponse.data);
            if (user !== null) {
              return response.success(res, "Sign in success", {
                expiresIn: expireTime * 60,
                accessToken: getToken(user)
              });
            } else {
              throw "Something wrong with google access_token";
            }
          }
        } catch (e) {
          return response.error(res, "Sign in failed", e);
        }
      });
    } catch (e) {
      return response.error(res, "Sign in failed", e);
    }
  },
  signInFacebook: async (req, res, next) => {
    passport.authenticate(
      "facebook",
      {
        session: false
      },
      (err, user) => {
        if (err || !user) {
          return response.error(
            res,
            err !== null
              ? err.message
              : "Something wrong with facebook access_token",
            e
          );
        }
        return response.success(res, "Sign in success", {
          expiresIn: expireTime * 60,
          accessToken: getToken(user)
        });
      }
    )(req, res, next);
  },
  verifyAccount: async (req, res, next) => {
    const { otp, email } = req.body;
    try {
      if (!validateEmail(email)) {
        throw "Email is incorrect";
      }
      let existedOtp = await OtpModel.findOne({
        where: {
          [Op.and]: [{ otp }, { type: 1 }, { email }]
        }
      });
      console.log(!!existedOtp);

      if (!!existedOtp) {
        let otpRecord = existedOtp.dataValues;
        if (validateOtpTime(otpRecord.createdAt)) {
          await UserModel.update(
            { is_verified: true },
            { where: { id_user: otpRecord.id_user } }
          );
          return response.success(res, "Account is verified");
        }
      } else throw "OTP not found";
    } catch (e) {
      return response.error(res, "Something wrong when verify", e);
    }
  },
  verifyAccountResend: async (req, res, next) => {
    try {
      const { email } = req.body;
      let user = await UserModel.findOne({
        where: { email }
      });
      if (!!user) user = user.dataValues;
      else throw "User not found";
      // Send verify to email & create OTP
      const otp = Math.floor(Math.random() * 1000000 + 1);
      await OtpModel.create({ otp, type: 1, id_user: user.id_user, email });
      const message = createMessage(email, otp, "Reset password OTP");
      sendEmail(message);
      return response.success(res, "OTP has been sent to email");
    } catch (e) {
      console.log(e);
      return response.error(res, "Something wrong when create otp", e);
    }
  },
  changePassword: async (req, res, next) => {
    try {
      const { email } = req.body;
      let user = await UserModel.findOne({
        where: { email }
      });
      if (!!user) user = user.dataValues;
      else throw "User not found";

      // Send verify to email & create OTP
      const otp = Math.floor(Math.random() * 1000000 + 1);
      await OtpModel.create({ id_user: user.id_user, otp, type: 2 });
      const message = createMessage(email, otp, "Reset password OTP");
      sendEmail(message);
      return response.success(res, "OTP has been sent to email");
    } catch (e) {
      console.log(e);
      return response.error(res, "Something wrong when create otp", e);
    }
  },
  verifyChangePassword: async (req, res, next) => {
    try {
      const { otp, password, email } = req.body;
      let user = await UserModel.findOne({
        where: { email }
      });
      if (!!user) user = user.dataValues;
      else throw "User not found";

      let existedOtp = await OtpModel.findOne({
        where: {
          [Op.and]: [{ otp }, { type: 2 }, { id_user: user.id_user }]
        }
      });
      if (existedOtp) {
        let otpRecord = existedOtp.dataValues;
        if (validateOtpTime(otpRecord.createdAt)) {
          let salt = await getSalt();
          bcrypt.hash(password, salt, async (error, hash) => {
            if (!error) {
              await UserModel.update(
                { password: hash },
                { where: { id_user: user.id_user } }
              );
              return response.success(res, "Change password complete");
            }
          });
        }
      }
    } catch (e) {
      return response.error(res, "Something wrong when verify", e);
    }
  }
};
