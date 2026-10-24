// backend/models/User.js
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true }, // UUID
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  role: { type: String, required: true, enum: ["student", "faculty", "admin"] },
  department: { type: String, default: null },
  password: { type: String, required: true },
  created_at: { type: Date, default: () => new Date() }
});

module.exports = mongoose.model("User", UserSchema);
