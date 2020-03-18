const jwt = require("jsonwebtoken");
const response = require("../../utils/Responses");
const cloudinary = require("cloudinary").v2;

const {
  validateEmail,
  validateString,
  convertDateToDATE,
  validateGender
} = require("../../utils/Authentication/validations");
const UserModel = require("../../models/users.model");
// const RoleModel = require("../../models/roles.model");
const { JWT_SECRET, expireTime } = require("../constants");

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
      return response.error(res, req.message);
    }
    let profile = {
      firstName: user.first_name,
      lastName: user.last_name,
      avatar: user.avatar,
      email: user.email,
      gender: user.gender,
      dob: user.dob
    };
    return response.success(res, "Get profile success", profile);
  },
  updateProfile: async (req, res, next) => {
    try {
      let { user } = req;
      let { firstName, lastName, dob, gender, email } = req.body;
      [firstName, lastName, gender, email] = validateString(
        [firstName, lastName, gender, email],
        ["firstName", "lastName", "gender", "email"]
      );
      if (!validateEmail(email) && email !== null)
        throw `email is not in correct format`;
      dob = dob === undefined ? null : convertDateToDATE(dob, "dob");
      validateGender(gender);

      await UserModel.update(
        {
          first_name: firstName === null ? user.first_name : firstName,
          last_name: lastName === null ? user.last_name : lastName,
          dob: dob === null ? user.dob : dob,
          gender: gender === null ? user.gender : gender
        },
        { where: { id_user: user.id_user } }
      );

      return response.success(res, "Update profile success");
    } catch (e) {
      console.log(e);
      return response.error(res, "Something wrong when update profile", e);
    }
  },
  updateAvatar: async (req, res, next) => {
    try {
      const { user } = req;

      let uploadResult = await cloudinary.uploader.upload(req.file.path);

      await UserModel.update(
        {
          avatar: uploadResult.url
        },
        { where: { id_user: user.id_user } }
      );

      return response.success(res, "Update avatar success", uploadResult.url);
    } catch (e) {
      // console.log(e);
      return response.error(res, "Something wrong when update avatar", e);
    }
  },
  // setRole: async (req, res, next) => {
  //   const { user } = req;
  //   const { userId, roleId } = req.body;
  //   try {
  //     let userRoleRecord = await UserRoleModel.findOne({
  //       where: { id_user: user.id_user }
  //     });
  //     userRoleRecord = !!userRoleRecord ? userRoleRecord.dataValues : null;
  //     if (userRoleRecord === null) throw "Your account do not have role";
  //     if (!userId || !roleId) throw "Missing userId or roleId";
  //     if (userRoleRecord.id_role <= roleId) {
  //       const upsertResult = await UserRoleModel.upsert(
  //         { id_user: userId, id_role: roleId },
  //         { id_role: roleId, id_user: userId }
  //       );
  //       if (upsertResult) {
  //         return response.accepted(res, "Set role success");
  //       } else throw "Upsert role failed";
  //     } else throw "Cannot set higher role than yours for this user";
  //   } catch (e) {
  //     console.log(e);
  //     return response.error(res, "Cannot set role", e);
  //   }
  // }
};
