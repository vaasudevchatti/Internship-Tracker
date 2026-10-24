const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// FIXED IMPORT ⬇️
const { authMiddleware } = require("../middleware/authMiddleware");

// Register
router.post("/register", authController.register);

// Login
router.post("/login", authController.login);

// Get current user
router.get("/me", authMiddleware, authController.getMe);

module.exports = router;
