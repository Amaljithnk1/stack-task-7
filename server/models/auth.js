import mongoose from "mongoose";

const loginHistorySchema = new mongoose.Schema({
  login_time: { type: Date, default: Date.now },
  browser: String,
  operating_system: String,
  device_type: String,
  ip_address: String,
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  about: { type: String },
  tags: { type: [String] },
  joinedOn: { type: Date, default: Date.now },
  loginHistory: [loginHistorySchema],
  resetToken: String,
  resetExpires: Date,
});

const User = mongoose.model("User", userSchema);

export default User;
