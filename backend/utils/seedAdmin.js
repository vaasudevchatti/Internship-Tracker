// backend/utils/seedAdmin.js
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const User = require("../models/User");

async function createAdmin() {
  try {
    console.log("Connecting to MongoDB…");
    await mongoose.connect(process.env.MONGO_URL, {
      dbName: process.env.DB_NAME || "internship_tracker",
    });

    const adminEmail = "admin@college.edu";

    const existing = await User.findOne({ email: adminEmail });
    if (existing) {
      console.log("Admin already exists.");
      process.exit(0);
    }

    // HASH THE PASSWORD
    const hashedPassword = await bcrypt.hash("admin123", 10);

    const adminUser = new User({
      id: uuidv4(),
      email: adminEmail,
      name: "Admin User",
      role: "admin",
      department: "Administration",
      password: hashedPassword,   // ← store HASHED password
      created_at: new Date()
    });

    await adminUser.save();

    console.log("Admin created successfully:");
    console.log("  Email: admin@college.edu");
    console.log("  Password: admin123");

    process.exit(0);
  } catch (err) {
    console.error("Error seeding admin:", err);
    process.exit(1);
  }
}

createAdmin();
