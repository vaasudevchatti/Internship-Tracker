// server.js
require("dotenv").config();
require("express-async-errors");

const path = require("path");
const express = require("express");
const cors = require("cors");
const fs = require("fs");

const connectDB = require("./config/db");

// Import routes (ONLY those that exist)
const authRoutes = require("./routes/authRoutes");
const internshipRoutes = require("./routes/internshipRoutes");
const reportRoutes = require("./routes/reportRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");

const app = express();

// ----------------------
// Middlewares
// ----------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS
const origins = (process.env.CORS_ORIGINS || "*").split(",");
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (origins.includes("*") || origins.includes(origin))
        return callback(null, true);
      return callback(new Error("Not allowed by CORS"), false);
    },
    credentials: true,
  })
);

// ----------------------
// Database Connection
// ----------------------
connectDB();

// ----------------------
// Ensure uploads folder
// ----------------------
const UPLOADS_DIR = path.join(__dirname, "uploads");
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR);

// Static serve uploaded files
app.use("/api/uploads", express.static(UPLOADS_DIR));

// ----------------------
// API Routes
// ----------------------
app.use("/api/auth", authRoutes);
app.use("/api/internships", internshipRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/analytics", analyticsRoutes);

// Health check
app.get("/api", (req, res) => {
  res.json({ message: "Backend working fine!" });
});

// ----------------------
// Global Error Handler
// ----------------------
app.use((err, req, res, next) => {
  console.error("GLOBAL ERROR:", err);

  if (res.headersSent) {
    return next(err); // do NOT send response again
  }

  res.status(500).json({ message: "Server error" });
});


// ----------------------
// Start Server
// ----------------------
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
