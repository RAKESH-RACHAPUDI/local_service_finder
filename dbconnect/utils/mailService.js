const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service : "gmail",
    auth:{
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS,
    },
})


const sendOTPEmail = async (toEmail, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: toEmail,
    subject: "SmartServe AI - Registration OTP",
    html: `
      <div style="font-family:sans-serif;">
        <h2>Welcome to <span style="color:#007bff;">SmartServe AI</span></h2>
        <p>Your OTP for registration is:</p>
        <h1 style="color:green;">${otp}</h1>
        <p>🕒 This OTP is valid for 5 minutes.</p>
        <p>If you didn’t request this, please ignore.</p>
      </div>
    `,
  };
try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Error sending OTP:", error);
    return false;
  }
};






module.exports = sendOTPEmail