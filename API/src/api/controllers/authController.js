const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
require("dotenv").config();
const db = require(`../models`)
const authService = require('../services/authService');

const logginSuccess = async (req, res) => {
  try {
    const { email } = req.body; 
    
    if (!email) {
      return res.status(400).json({
        err: 1,
        msg: 'missing inputs'
      });
    }
    let response = await authService.logginSuccessService(email);
    res.status(200).json(response);
  } catch (error) {
    console.error("Error in logginSuccess:", error);
    res.status(500).json({
      err: -1,
      msg: `fail at auth controller: ${error.message || error}`
    });
  }
};

const authController = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:8345/api/auth/google/redirect",
      },
      async function (accessToken, refreshToken, profile, cb) {
        const email = profile.emails[0]?.value;
        if (!email.endsWith("@vku.udn.vn")) {
          return cb(null, false, { message: "Miền email không được phép" });
        }
        try {
          if (email) {
            await db.Users.findOrCreate({
              where: { EMAIL: email },
              defaults: {
                FULLNAME: profile.displayName,
                EMAIL: email
              }
            });
          }
        } catch (error) {
          console.error("Error in findOrCreate:", error);
        }
        return cb(null, profile);
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((obj, done) => {
    done(null, obj);
  });
};

module.exports = { authController, logginSuccess };
