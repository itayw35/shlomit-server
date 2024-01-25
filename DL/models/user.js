const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userName: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  creationDate: { type: Date, default: Date.now },
  permission: {
    type: String,
    enum: ["admin", "editor", "viewer"],
    default: "admin",
  },
  isActive: { type: Boolean, default: true },
});
const userModel = mongoose.model("admin-user", userSchema);
exports.userModel = userModel;
