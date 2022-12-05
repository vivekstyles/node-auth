const mongoose = require("mongoose");

mongoose.connection.on("error", (err) => {
  console.log("Connection error", err);
});
module.exports = async () => {
  try {
    mongoose.set("bufferCommands", false);
    await mongoose.connect(
      "mongodb://myUserAdmin:knackforge@localhost:27017/",
      {
        // useNewUrlParser: true,
        // authMechanism: "DEFAULT",
      }
    );
    console.log("DB connected successfully");
  } catch (error) {
    console.error("db connect error: ", error);
  }
};
