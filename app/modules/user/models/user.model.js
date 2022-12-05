const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  user_id: Schema.Types.ObjectId,
  user_name: String,
  email_id: { type: String, default: "", required: true, unique: true },
  first_name: String,
  last_name: String,
  phone_no: Number,
  password: { type: String, default: "", private: true },
  isVerified: { type: Boolean, default: false },
  isEmailVerified: { type: Boolean, default: false },
  profile_pic: String,
  google_id: String,
  is_active: Boolean,
  created_on: { type: Date, default: Date.now },
  updated_on: { type: Date, default: Date.now },
  password_history: Array,
});

const User = mongoose.model("users", userSchema);

module.exports = { User };
