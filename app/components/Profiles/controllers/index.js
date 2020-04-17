"use strict";
const jwt = require("jsonwebtoken");
const response = require("../../../utils/Responses");
const cloudinary = require("cloudinary").v2;

const validators = require("../../../utils/Validations/validations");
const { UserModel } = require("../../../utils/Models");
const { JWT_SECRET, expireTime } = require("../../../utils/Constants");

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

      let uploadResult = await cloudinary.uploader.upload(req.file.path);
      await UserModel.update(
        { avatar: uploadResult.url },
        { where: { idUser: user.idUser } }
      );

      return response.success(res, "Update avatar success", uploadResult.url);
    } catch (e) {
      return response.error(res, "Something's wrong  when update avatar", e);
    }
  }
  // setRole: async (req, res, next) => {
  //   const { user } = req;
  //   const { idUser, idRole } = req.body;
  //   try {
  //     let userRoleRecord = await UserRoleModel.findOne({
  //       where: { idUser: user.idUser }
  //     });
  //     userRoleRecord = !!userRoleRecord ? userRoleRecord.dataValues : null;
  //     if (userRoleRecord === null) throw "Your account do not have role";
  //     if (!idUser || !idRole) throw "Missing idUser or idRole";
  //     if (userRoleRecord.idRole <= idRole) {
  //       const upsertResult = await UserRoleModel.upsert(
  //         { idUser: idUser, idRole: idRole },
  //         { idRole: idRole, idUser: idUser }
  //       );
  //       if (upsertResult) {
  //         return response.accepted(res, "Set role success");
  //       } else throw "Upsert role failed";
  //     } else throw "Cannot set higher role than yours for this user";
  //   } catch (e) {
  //
  //     return response.error(res, "Cannot set role", e);
  //   }
  // }
};
