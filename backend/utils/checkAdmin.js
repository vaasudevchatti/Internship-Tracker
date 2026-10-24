// utils/checkAdmin.js
require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");

async function check() {
  await mongoose.connect(process.env.MONGO_URL, {
    dbName: process.env.DB_NAME || "internship_tracker",
  });
  const u = await User.findOne({ email: "admin@college.edu" }).lean();
  console.log(u ? { email: u.email, role: u.role, id: u.id } : "Admin not found");
  await mongoose.disconnect();
}
check().catch(err => { console.error(err); process.exit(1); });
