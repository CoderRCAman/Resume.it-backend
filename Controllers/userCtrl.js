const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { google } = require("googleapis");
const { OAuth2 } = google.auth;
const client = new OAuth2(
  "223407826323-pcf12i097m2dbhqfdv9079nr23vjbkeg.apps.googleusercontent.com"
);
const Users = require("../models/index");

 const userCtrl = {
    googleLogin: async (req, res) => {
        try {
          const { tokenId } = req.body;
    
          const verify = await client.verifyIdToken({
            idToken: tokenId,
            audience:
              "223407826323-pcf12i097m2dbhqfdv9079nr23vjbkeg.apps.googleusercontent.com",
          });
    
          const { email_verified, email, name } = verify.payload;
    
          const password =
            email +
            "dasdasdasd>dasdas.daasdasdasdsdoovydnjadaya123sdqwd<>sdasdasdf";
    
          const passwordHash = await bcrypt.hash(password, 12);
    
          if (!email_verified)
            return res.status(400).json({ msg: "Email verification failed." });
    
          const user = await Users.findOne({ email: email });
    
          if (user) {
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch)
              return res.status(400).json({ msg: "Password is incorrect." });
    
            // const accesstoken = createAccessToken({id: user._id})
            const refresh_token = createRefreshToken({ id: user._id });
            res.cookie("refreshtoken", refresh_token, {
              httpOnly: true,
              path: "/user/refresh",
              maxAge: 7 * 24 * 60 * 60 * 1000, // 7d
            });
    
            // res.json({accesstoken})
            res.json({ msg: "Login success!" });
          } else {
            const newUser = new Users({
              name,
              email,
              password: passwordHash,
            });
    
            await newUser.save();
    
            // const accesstoken = createAccessToken({id: user._id})
            const refresh_token = createRefreshToken({ id: newUser._id });
            res.cookie("refreshtoken", refresh_token, {
              httpOnly: true,
              path: "/user/refresh",
              maxAge: 7 * 24 * 60 * 60 * 1000, // 7d
            });
    
            // res.json({accesstoken})
            res.json({ msg: "Login success!" });
          }
        } catch (err) {
          return res.status(500);
        }
      },
      refreshToken: (req, res) => {
        try {
          const rf_token = req.cookies.refreshtoken;
          if (!rf_token)
            return res.status(400).json({ msg: "Please Login or Register" });
    
          jwt.verify(
            rf_token,
            "qwertyuiop0987654321234567890poiuytrewqasdfghjkl1234567890",
            (err, user) => {
              if (err)
                return res.status(400).json({ msg: "Please Login or Register" });
    
              const accesstoken = createAccessToken({ id: user.id });
    
              res.json({ accesstoken });
            }
          );
        } catch (err) {
          return res.status(500).json({ msg: err.message });
        }
      },
      logout: async (req, res) => {
        try {
          res.clearCookie("refreshtoken", { path: "/user/refresh" });
          return res.json({ msg: "Logged out" });
        } catch (err) {
          return res.status(500).json({ msg: err.message });
        }
      },
      getAccessToken: (req, res) => {
        try {
          const rf_token = req.cookies.refreshtoken;
          if (!rf_token) return res.status(400).json({ msg: "Please login now!" });
    
          jwt.verify(
            rf_token,
            "qwertyuiop0987654321234567890poiuytrewqasdfghjkl1234567890",
            (err, user) => {
              if (err) return res.status(400).json({ msg: "Please login now!" });
    
              const access_token = createAccessToken({ id: user.id });
              res.json({ access_token });
            }
          );
        } catch (err) {
          return res.status(500).json({ msg: err.message });
        }
      },
}

const createAccessToken = (user) => {
  return jwt.sign(user, "asdfghjklkjhgfdsa1234567890987654321", {
    expiresIn: "11m",
  });
};
const createRefreshToken = (user) => {
  return jwt.sign(
    user,
    "qwertyuiop0987654321234567890poiuytrewqasdfghjkl1234567890",
    { expiresIn: "7d" }
  );
};

module.exports = userCtrl;