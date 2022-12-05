const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  user_id: Schema.Types.ObjectId,
  user_name: String,
  email_id: {
    type: String,
    unique: true, // `email` must be unique
  },
  phone_no: Number,
  password: String,
  profile_pic: String,
  google_id: String,
  is_active: Boolean,
  created_on: { type: Date, default: Date.now },
  updated_on: { type: Date, default: Date.now },
});

const passwordHistorySchema = new Schema({
  id: Schema.Types.ObjectId,
  user_id: String,
  email_id: String,
  password_history: [{}],
});

const Auth = mongoose.model("users", userSchema);
const PasswordHistory = mongoose.model("password_history", passwordHistorySchema);

module.exports = { Auth, PasswordHistory };
