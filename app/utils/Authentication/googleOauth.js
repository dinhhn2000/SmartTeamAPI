"use strict";
const google = require("googleapis").google;
const OAuth2 = google.auth.OAuth2;
const { googleClientId, googleClientSecret } = require("../Constants");
const oauth2Client = new OAuth2(googleClientId, googleClientSecret);

const { UserModel } = require("../../models");
module.exports = {
  oauth: async access_token => {
    try {
      await oauth2Client.setCredentials({
        access_token
      });
      return google.oauth2({
        auth: oauth2Client,
        version: "v2"
      });
    } catch (e) {
      throw e;
    }
  },
  googleAuth: async user => {
    try {
      let existedUser = await UserModel.findAll({
        where: {
          googleId: user.id
        }
      });
      if (existedUser.length > 0) {
        return existedUser[0].dataValues;
      } else {
        let newUser = UserModel.create({
          firstName: user.given_name,
          lastName: user.family_name,
          googleId: user.id,
          avatar: user.picture,
          is_verified: true
        });
        return newUser;
      }
    } catch (e) {
      console.log(e);
      return e;
    }
  }
};
