const express = require('express');
const otprouter = express.Router();

const { sendOtp, verifyOtp } = require("../controller/otpController");

otprouter.post("/send-otp", sendOtp);
otprouter.post("/verify-otp", verifyOtp);

module.exports = otprouter;
