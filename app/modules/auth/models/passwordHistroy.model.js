const mongoose = require("mongoose");
const { Schema } = mongoose;

const passwordHistorySchema = new Schema({
  id: Schema.Types.ObjectId,
  user_id: String,
  email_id: String,
  password_history: [{}],
});

const PasswordHistory = mongoose.model(
  "password_history",
  passwordHistorySchema
);

module.exports = PasswordHistory
