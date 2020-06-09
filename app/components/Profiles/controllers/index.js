"use strict";
const jwt = require("jsonwebtoken");
const response = require("../../../utils/Responses");
const cloudinary = require("cloudinary").v2;
const path = require("path");

const validators = require("../../../utils/Validations/validations");
const { UserModel } = require("../../../utils/Models");
const { JWT_SECRET, expireTime } = require("../../../utils/Constants");

function getToken(user) {
  let data = {
    idUser: user.idUser,
    firstName: user.firstName,
    lastName: user.lastName,
    avatar: user.avatar,
  };

  const token = jwt.sign(data, JWT_SECRET, {
    expiresIn: expireTime + "m",
  });

  return token;
}

module.exports = {
  getProfile: async (req, res, next) => {
    try {
      let { user } = req;
      if (!user) {
        return response.error(res, req.message);
      }
      let { idUser, firstName, lastName, avatar, email, gender, dob } = user;
      let profile = { idUser, firstName, lastName, avatar, email, gender, dob };
      return response.success(res, "Get profile success", profile);
    } catch (e) {
      return response.error(res, "Cannot get profile", e);
    }
  },
  updateProfile: async (req, res, next) => {
    try {
      let { user } = req;
      let { dob } = req.body;
      validators.validateProfileInfo(req.body);

      // Check email
      if (user.password !== null && req.body.email !== undefined) delete req.body.email;

      await UserModel.update(req.body, { where: { idUser: user.idUser } });

      return response.success(res, "Update profile success");
    } catch (e) {
      return response.error(res, "Something's wrong  when update profile", e);
    }
  },
  updateAvatar: async (req, res, next) => {
    try {
      const { user } = req;
      // console.log(req.file.path);
      let avatarUrl = user.avatar;
      avatarUrl = avatarUrl.split("/");
      avatarUrl = avatarUrl[avatarUrl.length - 1];
      avatarUrl = avatarUrl.split(".")[0];
      
      let removeResult = await cloudinary.uploader.destroy(avatarUrl);
      // console.log(removeResult);

      let uploadResult = await cloudinary.uploader.upload(req.file.path, {
        resource_type: "image",
      });
      await UserModel.update({ avatar: uploadResult.url }, { where: { idUser: user.idUser } });

      return response.success(res, "Update avatar success", uploadResult.url);
    } catch (e) {
      return response.error(res, "Something's wrong  when update avatar", e);
    }
  },
};
