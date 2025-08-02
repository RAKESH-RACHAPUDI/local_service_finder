const User = require("../model/userModel");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// ✅ USER REGISTER CONTROLLER
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;  
    // 🔍 Validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 🔁 Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    // 🔐 Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Save new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("User Register Error:", error.message);
    return res.status(500).json({ message: "Registration failed: " + error.message });
  }
};

// ✅ USER LOGIN CONTROLLER
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1️⃣ Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // 2️⃣ Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // 3️⃣ Generate JWT token
    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // 4️⃣ Respond with token + user info
    res.status(200).json({
      message: "Login success",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error: " + err.message });
  }
};

module.exports = {
  register,
  login,
};
