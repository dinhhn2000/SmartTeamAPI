const UserModel = require("../../models/users.model");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const { bcrypt, getSalt } = require("../../utils/Encrypt/bcrypt");
const { JWT_SECRET, expireTime } = require("../constants");
const {
  oauth,
  googleAuth
} = require("../../utils/Authentication/googleOauth");

function validateEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase()) && email.length > 0;
}

function validatePassword(password) {
  var re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
  return re.test(String(password));
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
  signUp: async (req, res, next) => {
    const { email, password, firstName, lastName } = req.body;

    if (!validateEmail(email)) {
      return res.status(400).json({
        message: "Email is incorrect"
      });
    }
    if (!validatePassword(password)) {
      return res.status(400).json({
        message:
          "Password has to be at least 8 characters, contains at least 1 digit, 1 lower case, 1 upper case"
      });
    }
    if (firstName.length === 0 || lastName.length === 0) {
      return res.status(400).json({
        message: "User's name is incorrect"
      });
    }

    // Check existed user
    try {
      let existedUser = await UserModel.findAll({
        where: {
          email
        }
      });

      if (existedUser.length !== 0) {
        return res.status(400).json({ message: `${email} has been used` });
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
            if (!!user)
              return res.json({
                message: "Sign up successful"
              });
            else
              return res.json({
                message: "Sign up fail"
              });
          }
        });
      }
    } catch (e) {
      console.log(e);
      return res.status(400).json({
        message: "Sign up failed"
      });
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
          return res.json({
            message
          });
        }
        res.status(200).json({
          message: "Sign in success",
          expiresIn: expireTime * 60,
          accessToken: getToken(user)
        });
      }
    )(req, res, next);
  },
  signInGoogle: async (req, res, next) => {
    const { access_token } = req.body;
    if (!access_token) {
      return res.status(400).json({
        message: "You should provide access_token"
      });
    }
    const oauth2 = oauth(access_token);
    oauth2.userinfo.get(async (err, response) => {
      if (err) {
        console.log(access_token);

        return res.status(400).json({
          message: "The access_token is incorrect"
        });
      } else {
        const user = await googleAuth(response.data);
        if (user !== null) {
          return res.json({
            message: "Sign in success",
            expiresIn: expireTime * 60,
            accessToken: getToken(user)
          });
        } else {
          return res.status(400).json({
            message: "Something wrong with google access_token"
          });
        }
      }
    });
  },
  signInFacebook: async (req, res, next) => {
    passport.authenticate(
      "facebook",
      {
        session: false
      },
      (err, user) => {
        if (err || !user) {
          return res.status(400).json({
            message:
              err !== null
                ? err.message
                : "Something wrong with facebook access_token"
          });
        }
        return res.json({
          message: "Sign in success",
          expiresIn: expireTime * 60,
          accessToken: getToken(user)
        });
      }
    )(req, res, next);
  }
};
