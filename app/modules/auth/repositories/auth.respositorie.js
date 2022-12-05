const { User } = require("../../user/models/user.model");
const UrlHits = require("../../auth/models/urlHits.model");
const { save } = require("../../user/repositories/user.repositories");

const authRepository = {
  newUser: async (queryData) => {
    const data = await User({
      email_id: queryData.email_id,
      password: queryData.password,
      password_history: queryData.password,
    }).save();
    return data;
  },

  getUserByEmail: async (email_id) => {
    const data = await User.findOne({
      email_id: email_id,
    });

    return data;
  },
  countIp: async (ip, userAgent) => {
    console.log(ip);

    const chk_aldy_exits = await UrlHits.findOne({ IP_address: ip });
    if (chk_aldy_exits) {
      console.log(chk_aldy_exits);
      if (chk_aldy_exits.hit_count == 3) {
        let date1 = new Date();
        console.log(
          "dfhgsjfdgs",
          typeof date1,
          typeof chk_aldy_exits.created_on.toISOString()
        );

        // check if blocked ip is expired if so then unblock the ip
        if (chk_aldy_exits.created_on.toISOString() < date1.toISOString()) {
          chk_aldy_exits.is_IP_blocked = false;
          chk_aldy_exits.hit_count = 0;
          await chk_aldy_exits.save();
          return chk_aldy_exits.is_IP_blocked;
        }
        // block the ip address
        chk_aldy_exits.is_IP_blocked = true;
        await chk_aldy_exits.save();
        return chk_aldy_exits.is_IP_blocked;
      }
      chk_aldy_exits.hit_count++;
      await chk_aldy_exits.save();
      return chk_aldy_exits.is_IP_blocked;
    } else {
      console.log("new data");

      Date.prototype.addHours = function (h) {
        this.setHours(this.getHours() + h);
        return this;
      };

      let one_hour = new Date().addHours(1);

      const data = UrlHits({
        IP_address: ip,
        hit_count: 1,
        is_IP_blocked: false,
        created_on: one_hour,
        user_agent: new Map(Object.entries(userAgent)),
      }).save();

      return false;
    }
  },
  saveUsersPassword: async (param) => {
    const date = new Date();
    const updated_password = await User.updateOne(
      { email_id: param.email_id },
      { password: param.new_password }
    );
    console.log("update password", updated_password);
    try {
      const saved = await User.update(
        { email_id: param.email_id },
        { $push: { password_history: param.new_password } }
      );

      const pass_list = await User.findOne({
        email_id: param.email_id,
      });

      console.log(pass_list.password_history.length);

      if (pass_list.password_history.length > 3) {
        const saved = await User.updateOne(
          { email_id: param.email_id },
          { $pop: { password_history: -1 } }
        );
      }

      console.log(pass_list.password_history.length);

      return true;
    } catch (error) {
      return error;
    }
  },

  // insertPasswordHistory: async (param) => {
  //   const date = new Date();
  //   const insert_data = {date : param.password}
  //   const data = await PasswordHistory({
  //     email_id: param.email_id,
  //   }).save();

  //   const saved =await PasswordHistory.update(
  //     { email_id: param.email_id },
  //     { $addToSet: { password_history: insert_data } }
  //   );
  //     console.log(saved)
  //   return data;
  // },

  checkIfPasswordExits: async (email_id) => {
    const data = await User.findOne({ email_id: email_id });
    console.log("checkIfPasswordExits", data);
    if (data == null) return null;
    const pass_list = data.password_history;
    return pass_list;
  },

  getPasswordHistory: async (email) => {
    const data = await PasswordHistory.find();
    console.log("saved", data);
    return data;
  },
};

module.exports = authRepository;
