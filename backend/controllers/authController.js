const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// REGISTER
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, department } = req.body;

    // Check if email exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ detail: "Email already registered" });
    }

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    // Create user object
    const newUser = new User({
      id: uuidv4(),            // UUID string
      name,
      email,
      role,
      department: department || null,
      password: hashed,
      created_at: new Date()
    });

    await newUser.save();

    // return user without password
    const unsafe = newUser.toObject();
    delete unsafe.password;

    return res.json(unsafe);

  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ detail: "Server error" });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // find user
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ detail: "Invalid credentials" });

    // check password
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ detail: "Invalid credentials" });

    // JWT token – MUST include full user details
    const token = jwt.sign(
      {
        sub: user.id,        // UUID
        email: user.email,
        name: user.name,
        role: user.role,
        department: user.department || null,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "24h" }
    );

    // return safe user
    const unsafe = user.toObject();
    delete unsafe.password;

    res.json({
      access_token: token,
      token_type: "bearer",
      user: unsafe
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ detail: "Server error" });
  }
};

// GET CURRENT USER
exports.getMe = async (req, res) => {
  try {
    // req.user.id comes from authMiddleware → decoded.sub
    const user = await User.findOne({ id: req.user.id }).select("-password");

    if (!user)
      return res.status(401).json({ detail: "User not found" });

    res.json(user);

  } catch (err) {
    console.error("AUTH ME ERROR:", err);
    res.status(500).json({ detail: "Server error" });
  }
};
