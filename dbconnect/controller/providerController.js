// controller/providerAuthController.js

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Provider = require("../model/ProviderModel");
const Token = require("../model/tokenModel");

const providerRegister = async (req, res) => {
  try {
    const { token, email, name, phone, profession, password } = req.body;

    // ✅ Step 1: Validate all fields
    if (!token || !email || !name || !phone || !profession || !password) {
      return res.status(400).json({
        success: false,
        message: "❗All fields are required. Token or Email missing.",
      });
    }

    // ✅ Step 2: Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: "❌ Token expired or invalid. Please try again.",
      });
    }

    // ✅ Step 3: Check if token exists in DB
    const tokenDoc = await Token.findOne({ token });
    if (!tokenDoc) {
      return res.status(400).json({
        success: false,
        message: "⚠️ Token already used or not found.",
      });
    }

    // ✅ Step 4: Validate email in token
    if (decoded.email !== email) {
      return res.status(403).json({
        success: false,
        message: "⚠️ Email mismatch. Use the link from your email.",
      });
    }

    // ✅ Step 5: Check duplicate
    const existing = await Provider.findOne({ email });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: "⚠️ Provider already registered. Please login.",
      });
    }

    // ✅ Step 6: Hash + Save
    const hashedPassword = await bcrypt.hash(password, 10);

    const newProvider = await Provider.create({
      name,
      email,
      phone,
      profession,
      password: hashedPassword,
      isVerified: true,
    });

    // ✅ Step 7: Remove used token
    await Token.deleteOne({ token });

    return res.status(201).json({
      success: true,
      message: "🎉 Provider registered successfully.",
      provider: {
        id: newProvider._id,
        name: newProvider.name,
        email: newProvider.email,
        profession: newProvider.profession,
      },
    });

  } catch (err) {
    console.error("💥 providerRegister Error:", err.message);
    return res.status(500).json({
      success: false,
      message: "💥 Server error during registration.",
    });
  }
};

// ✅ Provider Login
const providerLogin = async (req, res) => {
  const { email, password } = req.body;

  // Step 1: Validate input (ensure both email and password are provided)
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "⚠️ Both email and password are required.",
    });
  }

  try {
    // Step 2: Find provider by email
    const provider = await Provider.findOne({ email });
    if (!provider) {
      return res.status(404).json({
        success: false,
        message: "⚠️ No provider found with this email.",
      });
    }

    // Step 3: Check if email is verified
    if (!provider.isVerified) {
      return res.status(403).json({
        success: false,
        message: "⚠️ Email not verified. Please complete registration via email.",
      });
    }

    // Step 4: Match password using bcrypt
    const isMatch = await bcrypt.compare(password, provider.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "❌ Incorrect password. Please try again.",
      });
    }

    // Step 5: Generate JWT token for authenticated provider
    const token = jwt.sign(
      { providerId: provider._id, role: "provider" }, // payload contains provider's unique ID and role
      process.env.JWT_SECRET, // secret key stored in environment variable
      { expiresIn: process.env.JWT_EXPIRY || "1h" } // JWT expiry can be configured
    );

    // Step 6: Send response with provider info and the generated token
    return res.status(200).json({
      success: true,
      message: "✅ Login successful.",
      token, // Sending the JWT token
      provider: {
        id: provider._id,
        name: provider.name,
        email: provider.email,
        phone: provider.phone,
        profession: provider.profession, // Any additional fields you want to include
      },
    });
  } catch (err) {
    // Handle server error
    console.error("💥 Login Error:", err.message);
    return res.status(500).json({
      success: false,
      message: "💥 Server error during login. Please try again later.",
    });
  }
};


module.exports = {
  providerRegister,
  providerLogin,
};
