const jwt = require("jsonwebtoken");
const Provider = require("../model/ProviderModel");

const protectProvider = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("🚫 Unauthorized: No Bearer Token");
      return res.status(401).json({ message: "🚫 Unauthorized: No Bearer Token" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      console.log("🚫 Unauthorized: No Token");
      return res.status(401).json({ message: "🚫 Unauthorized: No Token" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.providerId) {
      console.log("⛔ Invalid Token Payload: No provider ID in the token");
      return res.status(401).json({ message: "⛔ Invalid Token Payload" });
    }

    // Check provider existence in the database
    const provider = await Provider.findById(decoded.providerId);
    if (!provider) {
      console.log(`❌ Provider not found for ID: ${decoded.providerId}`);
      return res.status(404).json({ message: "❌ Provider not found" });
    }

    req.providerId = provider._id;
    req.provider = provider;

    console.log(`✅ Provider authenticated: ${provider.name}`);
    next(); // Proceed to next middleware or route handler
  } catch (err) {
    console.error("💥 Token Error: ", err);

    // Handle JWT errors
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "⛔ Token Expired" });
    }

    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "⛛ Invalid Token" });
    }

    return res.status(401).json({
      message: "⛔ Invalid or Expired Token",
      error: err.message,
    });
  }
};

module.exports = { protectProvider };
