const jwt = require("jsonwebtoken");
const config = require("../../config/serviceConfig");

module.exports = function auth(req, res, next) {
  try {
    const token = (req.headers.authorization || "").replace("Bearer ", "");
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const payload = jwt.verify(token, config.jwtSecret);
    req.user = payload; // expects at least { id }
    if (!req.user?.id) return res.status(401).json({ message: "Invalid token payload" });

    next();
  } catch (e) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};
