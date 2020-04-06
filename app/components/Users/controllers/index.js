"use strict";
const passport = require("passport");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");

const response = require("../../../utils/Responses");
const validators = require("../../../utils/Validations/validations");
const models = require("../../../utils/Models");
const { bcrypt, getSalt } = require("../../../utils/Encrypt");
const { JWT_SECRET, expireTime } = require("../../../utils/Constants");
const { oauth, googleAuth } = require("../../../utils/Authentication/googleOauth");
const { sendEmail, createMessage } = require("../../../utils/Email");

function getToken(user) {
  let data = {
    idUser: user.idUser,
    firstName: user.firstName,
    lastName: user.lastName,
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
      validators.validateEmail(email);
      validators.validatePassword(password);
      validators.validateUserName(firstName, lastName);

      // Check existed user
      let existedUser = await models.UserModel.findAll({ where: { email } });
      if (existedUser.length !== 0) {
        throw `${email} has been used`;
      } else {
        let salt = await getSalt();
        bcrypt.hash(password, salt, async (error, hash) => {
          if (!error) {
            let user = await models.UserModel.create({
              firstName,
              lastName,
              email,
              password: hash,
              avatar: "https://icon-library.net/images/bot-icon/bot-icon-18.jpg"
            });
            // Send verify to email & create OTP
            const otp = Math.floor(Math.random() * 1000000 + 1);
            await models.OtpModel.create({
              idUser: user.idUser,
              otp,
              type: 1,
              email: user.email
            });
            const message = createMessage(email, otp, "Account verification");
            sendEmail(message);

            return response.created(res, "Sign up successful");
          } else throw error;
        });
      }
    } catch (e) {
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
          if (typeof message.message !== "undefined") message = message.message;
          if (!err) return response.error(res, message);
          else return response.error(res, message, err);
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
      validators.validateAccessToken(access_token);
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
            err !== null ? err.message : "Required access_token"
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
      validators.validateEmail(email);
      validators.validateOtp(otp);

      let existedOtp = await models.OtpModel.findOne({
        where: {
          [Op.and]: [{ otp }, { type: 1 }, { email }]
        },
        raw: true
      });
      if (!!existedOtp) {
        validators.validateOtpTime(existedOtp.createdAt);
        await models.UserModel.update(
          { is_verified: true },
          { where: { idUser: existedOtp.idUser } }
        );
        await models.OtpModel.destroy({
          where: { idUser: existedOtp.idUser }
        });
        return response.success(res, "Account is verified");
      } else throw "OTP is incorrect";
    } catch (e) {
      return response.error(res, "Something wrong when verify", e);
    }
  },
  verifyAccountResend: async (req, res, next) => {
    try {
      const { email } = req.body;
      validators.validateEmail(email);

      let user = await models.UserModel.findOne({
        where: { email }
      });
      if (!!user) user = user.dataValues;
      else throw "User not found";
      // Send verify to email & create OTP
      const otp = Math.floor(Math.random() * 1000000 + 1);
      await models.OtpModel.create({ otp, type: 1, idUser: user.idUser, email });
      const message = createMessage(email, otp, "Reset password OTP");
      sendEmail(message);
      return response.success(res, "OTP has been sent to email");
    } catch (e) {
      return response.error(res, "Something wrong when create otp", e);
    }
  },
  changePassword: async (req, res, next) => {
    try {
      const { email } = req.body;
      validators.validateEmail(email);

      let user = await models.UserModel.findOne({
        where: { email }
      });
      if (!!user) user = user.dataValues;
      else throw "User not found";

      // Send verify to email & create OTP
      const otp = Math.floor(Math.random() * 1000000 + 1);
      await models.OtpModel.create({ idUser: user.idUser, otp, type: 2 });
      const message = createMessage(email, otp, "Reset password OTP");
      sendEmail(message);
      return response.success(res, "OTP has been sent to email");
    } catch (e) {
      return response.error(res, "Something wrong when create otp", e);
    }
  },
  verifyChangePassword: async (req, res, next) => {
    try {
      const { otp, password, email } = req.body;
      validators.validateEmail(email);
      validators.validatePassword(password);
      validators.validateOtp(otp);

      let user = await models.UserModel.findOne({ where: { email }, raw: true });
      if (!!user) user = user;
      else throw "Email not found";

      let existedOtp = await models.OtpModel.findOne({
        where: {
          [Op.and]: [{ otp }, { type: 2 }, { idUser: user.idUser }]
        },
        raw: true
      });
      if (!!existedOtp) {
        validators.validateOtpTime(existedOtp.createdAt);
        let salt = await getSalt();
        bcrypt.hash(password, salt, async (error, hash) => {
          if (!error) {
            await models.UserModel.update(
              { password: hash },
              { where: { idUser: user.idUser } }
            );
            await models.OtpModel.destroy({
              where: { idUser: existedOtp.idUser }
            });
            return response.success(res, "Change password complete");
          }
        });
      } else throw "OTP is incorrect";
    } catch (e) {
      return response.error(res, "Something wrong when verify", e);
    }
  }
};
