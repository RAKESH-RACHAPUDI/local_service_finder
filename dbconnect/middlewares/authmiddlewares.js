const jwt = require("jsonwebtoken");
const User = require("../model/userModel");

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Access Denied: No Token Provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: "Invalid Token or Expired" });
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: "Unauthorized: " + err.message });
  }
};

module.exports = authMiddleware;
