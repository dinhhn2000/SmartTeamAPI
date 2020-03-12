const google = require("googleapis").google;
const OAuth2 = google.auth.OAuth2;
const oauth2Client = new OAuth2();

const UserModel = require("../../models/users.model");

module.exports = {
  oauth2Client,
  google,
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
          first_name: user.given_name,
          last_name: user.family_name,
          googleId: user.id,
          avatar: user.picture
        });
        return newUser;
      }
    } catch (e) {
      console.log(e);
      return null;
    }
  }
};
