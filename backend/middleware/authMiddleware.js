const jwt = require("jsonwebtoken");

exports.authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader)
      return res.status(401).json({ detail: "Missing Authorization header" });

    const token = authHeader.split(" ")[1]; // Bearer token

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    req.user = {
      id: decoded.sub,
      email: decoded.email,
      name: decoded.name,
      role: decoded.role,
    };

    next();
  } catch (err) {
    return res.status(401).json({ detail: "Invalid or expired token" });
  }
};
