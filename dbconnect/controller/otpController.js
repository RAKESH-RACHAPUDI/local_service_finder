const Otp = require("../model/Otp");
const User = require("../model/userModel");
const sendOTPEmail = require("../utils/mailService");

const sendOtp = async (req, res) => {
  const { email } = req.body;

  console.log("Received Email:", email);  // 🔍 Log to verify

  try {
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await Otp.deleteMany({ email });
    const expiry = new Date(Date.now() + 5 * 60 * 1000);
    await Otp.create({ email, otp, expiresAt: expiry });

    const sent = await sendOTPEmail(email, otp);
    if (sent) {
      res.status(200).json({ message: "OTP sent to your email" });
    } else {
      res.status(500).json({ message: "Failed to send OTP" });
    }
  } catch (error) {
    console.error("Send OTP Error:", error); // 🔍 Backend console log
    res.status(500).json({ message: "Server Error", error });
  }
};


const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const otpEntry = await Otp.findOne({ email });

    if (!otpEntry) {
      return res.status(400).json({ message: "OTP expired or not found" });
    }

 
    if (otpEntry.expiresAt < Date.now()) {
      await Otp.deleteMany({ email });
      return res.status(400).json({ message: "OTP has expired" });
    }

   
    if (otpEntry.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

   
    await Otp.deleteMany({ email });
    res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};
module.exports ={sendOtp,verifyOtp}