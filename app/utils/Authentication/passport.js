"use strict";
const passport = require("passport");
const passportJWT = require("passport-jwt");
const passportLocal = require("passport-local");
const bcrypt = require("bcryptjs");
const facebookStrategy = require("passport-facebook-token");

const LocalStrategy = passportLocal.Strategy;
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

const { UserModel } = require("../../models");
const {
  JWT_SECRET,
  facebookClientId,
  facebookClientSecret
} = require("../Constants");

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});

const jwt = new JWTStrategy(
  {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: JWT_SECRET
  },
  async (jwtPayload, cb) => {
    try {
      let existedUser = await UserModel.findOne({
        where: { id_user: jwtPayload.userId }
      });
      if (existedUser.length !== 0) {
        return cb(null, existedUser.dataValues);
      } else {
        return cb(null, false, { message: "Not found user" });
      }
    } catch (e) {
      console.log(e);
      return cb(e);
    }
  }
);

const local = new LocalStrategy(
  {
    usernameField: "email",
    passwordField: "password"
  },
  async (email, password, cb) => {
    try {
      let existedUser = await UserModel.findAll({
        where: {
          email
        }
      });
      if (existedUser.length > 0) {
        let user = existedUser[0].dataValues;
        if (user.is_verified === false)
          return cb(null, false, "User is not verified.");
        bcrypt.compare(password, user.password, (err, res) => {
          if (res) {
            // console.log(user);
            return cb(null, user);
          } else return cb(null, false, "Incorrect email or password.");
        });
      } else return cb(null, false, "Incorrect email or password.");
    } catch (e) {
      return cb(e);
    }
  }
);

// Facebook strategy
const facebook = new facebookStrategy(
  {
    clientID: facebookClientId,
    clientSecret: facebookClientSecret
  },
  async (accessToken, refreshToken, profile, cb) => {
    // Check existed user
    try {
      let existedUser = await UserModel.findAll({
        where: {
          facebookId: profile.id
        }
      });
      if (existedUser.length > 0) {
        let user = existedUser[0].dataValues;
        return cb(null, user);
      } else {
        let newUser = await UserModel.create({
          first_name: profile.name.givenName,
          last_name: profile.name.familyName,
          facebookId: profile.id,
          avatar: profile.photos[0].value,
          is_verified: true
        });
        return cb(null, newUser);
      }
    } catch (e) {
      return cb(e);
    }
  }
);

passport.use(jwt);
passport.use(local);
passport.use("facebook", facebook);
