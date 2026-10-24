// utils/removeAdmin.js
require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");

async function removeAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      dbName: process.env.DB_NAME || "internship_tracker",
    });
    console.log("Connected to MongoDB");
    const res = await User.deleteOne({ email: "admin@college.edu" });
    console.log("deleteOne result:", res);
    await mongoose.disconnect();
    console.log("Disconnected. Admin removed (if existed).");
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
}

removeAdmin();
