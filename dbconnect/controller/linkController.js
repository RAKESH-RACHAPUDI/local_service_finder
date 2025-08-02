const jwt = require("jsonwebtoken");
const Token = require("../model/tokenModel");
const sendOTPEmail = require("../utils/providerMailservice");

const sendProviderLink = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: "⛔ Email is required." });
  }

  try {
    // 1. Generate a new JWT token for this email (expires in 10 min)
    const jwtToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "10m" });

    // 2. Remove any previous tokens for this email (one active link at a time)
    await Token.deleteMany({ email });

    // 3. Store the new token in DB
    await Token.create({ email, token: jwtToken });

    // 4. Build the registration link
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const link = `${frontendUrl}/provider/register?token=${jwtToken}&email=${encodeURIComponent(email)}`;

    // 5. Prepare and send the email
    const html = `
      <div style="font-family:sans-serif;">
        <h2>SmartServeAI – Provider Registration Link</h2>
        <p>Click the below link to complete your registration:</p>
        <a href="${link}" target="_blank">${link}</a>
        <p><strong>Note:</strong> This link will expire in 10 minutes.</p>
      </div>
    `;

    const sent = await sendOTPEmail(email, html, "SmartServeAI – Provider Register Link");

    if (sent) {
      return res.status(200).json({ success: true, message: "✅ Link sent to your email." });
    } else {
      return res.status(500).json({ success: false, message: "❌ Email sending failed." });
    }

  } catch (err) {
    console.error("💥 sendProviderLink Error:", err.message);
    return res.status(500).json({ success: false, message: "💥 Server error.", error: err.message });
  }
};

module.exports = { sendProviderLink };