const jwt = require("jsonwebtoken");
const authRepo = require("../../auth/repositories/auth.respositorie");
require("dotenv").config();

const middleware = {
  signUp: (req, res, next) => {
    if (req.is("json")) {
      if (
        req.body.email_id &&
        req.body.password &&
        req.body.email_id != "" &&
        req.body.password != "" &&
        req.body.email_id != " " &&
        req.body.password != " "
      ) {
        next();
      } else {
        res.json({ error: "406", data: [], message: "missing values" });
      }
    } else {
      res.json({ error: "400", data: [], message: "expect json type" });
    }
  },
  TokenValidate: (req, res, next) => {
    try {
      let tokenTrim = req.headers.authorization.split(" ");

      const decoded = jwt.verify(
        `${tokenTrim[1]}`,
        process.env.APP_CRYPTO_SECRET,
        {
          algorithms: ["HS256"],
        }
      );
      console.log(decoded);
      next();
    } catch (error) {
      console.log("Error through", error.name);
      if (error.name == "JsonWebTokenError") {
        return res.redirect("/user/tokenInvalid");
      } else if (error.name == "TokenExpiredError") {
        res.redirect("/user/tokenEx");
      } else {
        return res.redirect("/user/tokenInvalid");
      }
    }
  },
  blockIP: async (req, res, next) => {
    if (req.headers.authorization) return next();

    let ip_check = await authRepo.countIp(
      req.socket.remoteAddress,
      req.useragent
    );

    if (!ip_check) return next();

    res.send("you blocked for an hour");
  },

  forgotPassword: (req, res, next) => {
    if (req.is("json")) {
      if (
        req.body.email_id &&
        req.body.email_id != "" &&
        req.body.email_id != " "
      ) {
        next();
      } else {
        res.json({ error: "406", data: [], message: "missing values" });
      }
    } else {
      res.json({ error: "400", data: [], message: "expect json type" });
    }
  },
};

module.exports = middleware;
