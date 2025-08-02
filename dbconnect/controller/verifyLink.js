const jwt = require("jsonwebtoken");
const Token = require("../model/tokenModel");

const verifyProviderToken = async (req, res) => {
  const { token, email } = req.query;

  if (!token || !email) {
    return res.status(400).json({
      valid: false,
      message: "❌ Token or Email is missing in URL.",
    });
  }

  try {
    // ✅ Step 1: Decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Step 2: Find token in DB
    const tokenInDb = await Token.findOne({ email, token });
    if (!tokenInDb) {
      return res.status(400).json({
        valid: false,
        message: "❌ Token not found in DB. Maybe it expired or already used?",
      });
    }

    // ✅ Step 3: Match decoded email with passed email
    if (decoded.email !== email) {
      return res.status(403).json({
        valid: false,
        message: "❌ Token is not valid for this email.",
      });
    }

    // ✅ Token is verified
    return res.status(200).json({
      valid: true,
      message: "✅ Token verified successfully.",
      email: decoded.email,
    });

  } catch (err) {
    console.error("❌ Token verification error:", err.message);
    return res.status(401).json({
      valid: false,
      message: "❌ Token validation failed. Token may be expired.",
      error: err.message,
    });
  }
};

module.exports = { verifyProviderToken };
