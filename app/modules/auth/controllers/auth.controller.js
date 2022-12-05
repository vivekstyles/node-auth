const authRepo = require("../repositories/auth.respositorie");
const sendMail = require("../../../util/mailer");
let bcrypt = require("bcrypt");

class AuthController {
  async signUp(req) {
    let payload = {};
    const param = {};
    param.email_id = req.body.email_id;
    const checkUserExist = await authRepo.getUserByEmail(param.email_id);
    if (checkUserExist) return (payload.data = { error: "user Already exits" });
    let hashed_password = await this.cryptPassword(req.body.password);
    param.password = hashed_password;
    const data = await authRepo.newUser(param);
    const otp = this.genrateOTP(0, 9);
    req.session.user_otp = otp;
    let mailOptions = {
      from: "knackforge@gmail.com",
      to: data.email_id,
      subject: "Sign up OTP",
      text: otp,
    };
    sendMail(mailOptions);

    payload.status = 200;
    payload.data = { email_id: data.email_id };
    payload.message = "OTP sent to your Email.";

    return payload;
  }

  async validateOTP(req) {
    req.query.count = req.query.count + 1;
    console.log(req.session.user_otp);
    let payload = {};
    if (req.session.user_otp == 0)
      return (payload.data = { status: "404", message: "otp expired" });
    try {
      if (req.query.otp === req.session.user_otp) {
        console.log("yes");
        console.log("OTP :", req.session.user_otp);
        req.session.user_otp = 0;
        const data = await authRepo.getUserByEmail(req.query.email_id);
        payload.status = 200;
        payload.data = data;
        payload.message = "your OTP is verified";

        return payload;
      } else {
        console.log("no");
        console.log(req.query.otp);
        payload.status = 400;
        payload.data = [];
        payload.message = "your OTP is invalid";

        return payload;
      }
    } catch (error) {
      payload.status = 400;
      payload.data = [];
      payload.message = error.message;
      return payload;
    }
  }

  genrateOTP(min, max) {
    let otp = "";
    for (let i = 0; i < 4; i++) {
      otp += Math.floor(Math.random() * (max - min + 1) + min) + "";
    }
    return otp;
  }

  async login(req) {
    const param = {};
    param.email_id = req.body.email_id;
    let payload = {};
    const data = await authRepo.getUserByEmail(param.email_id);
    if (!data) return (payload.data = {});

    let check_if_match = await this.comparePassword(
      req.body.password,
      data.password
    );
    console.log("check_if_match", check_if_match);
    if (check_if_match) {
      payload.status = 200;
      payload.data = {
        email_id: data.email_id,
        user_exits: true,
        authentication: true,
      };
      return payload;
    } else {
      payload.status = 400;
      payload.data = {
        user_exits: true,
        authentication: false,
      };
      return payload;
    }
  }

  async cryptPassword(password) {
    let hashed = await new Promise((resolve, reject) => {
      bcrypt.hash(password, 10, function (err, hash) {
        if (err) reject(err);
        resolve(hash);
      });
    });

    return hashed;
  }

  async comparePassword(plainPass, hashword) {
    return bcrypt.compareSync(plainPass, hashword);
  }

  async changePassword(req) {
    const param = {};
    param.email_id = req.body.email_id;
    param.password = req.body.current_password;

    let payload = {};
    const data = await authRepo.getUserByEmail(param.email_id);
    if (!data) return (payload.data = {});

    const checkCurrentPassword = await this.comparePassword(
      req.body.current_password,
      data.password
    );

    if (!checkCurrentPassword)
      return (payload.data = { message: "current password wrong" });

    const password_list = await authRepo.checkIfPasswordExits(data.email_id);
    if (password_list == null) return false;
    let check_if_match = false;
    try {
      for (const [key, value] of Object.entries(password_list)) {
        console.log(`${key}: ${value}`);

        check_if_match = await this.comparePassword(
          req.body.new_password,
          value
        );

        console.log("password exits : ", check_if_match);
        if (check_if_match) {
          payload.data = {
            error: "repeat password",
            message: "cant use these password",
          };
          return payload.data;
        }
      }

      if (!check_if_match) {
        let hashed_new_password = await this.cryptPassword(
          req.body.new_password
        );

        param.new_password = hashed_new_password;

        console.log("new password key", param.new_password);

        let ifSaved = await authRepo.saveUsersPassword(param);
        if (ifSaved) {
          payload.data = {
            status: 200,
            message: "new password successfully update",
          };
        }
        return payload.data;
      }
    } catch (error) {
      console.log(error);
    }
  }

  async forgotPassword(req) {
    let payload = {};
    const param = {};
    param.email_id = req.body.email_id;
    const userData = await authRepo.getUserByEmail(param.email_id);
    if (!userData) return (payload.data = { error: "user not exits" });
    const otp = this.genrateOTP(0, 9);
    req.session.password_forgot_otp = otp;
    let mailOptions = {
      from: "knackforge@gmail.com",
      to: userData.email_id,
      subject: "Forgot OTP",
      text: otp,
    };
    await sendMail(mailOptions);
    payload.status = 200;
    payload.data = {};
    payload.message = "OTP sent to your Email.";

    return payload;
  }

  forgotPasswordOTP(req) {
    console.log(req.session);
    console.log(req.query.otp);
    let payload = {};
    if (req.session.password_forgot_otp == 0)
      return (payload.data = { status: "404", message: "otp expired" });
    try {
      if (req.query.otp === req.session.password_forgot_otp) {
        console.log("yes");
        req.session.password_forgot_otp = 0;
        payload.status = 200;
        payload.data = [];
        payload.message = "your OTP is verified";

        return payload;
      } else {
        console.log("no");
        payload.status = 400;
        payload.data = [];
        payload.message = "your OTP is not match";

        return payload;
      }
    } catch (error) {
      payload.status = 400;
      payload.data = [];
      payload.message = error.message;
      return payload;
    }
  }
}

module.exports = new AuthController();
