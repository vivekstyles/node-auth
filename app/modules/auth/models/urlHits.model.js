const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  id: Schema.Types.ObjectId,
  IP_address: String,
  hit_count: Number,
  is_IP_blocked: Boolean,
  created_on: { type: Date, default: Date.now },
  user_agent : Map
});

const UrlHits = mongoose.model("url_hits", userSchema);

module.exports = UrlHits;
