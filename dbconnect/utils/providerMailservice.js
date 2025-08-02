const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Optional: Verify transporter at startup
transporter.verify((err, success) => {
  if (err) {
    console.error("❌ Email transporter config error:", err);
  } else {
    console.log("✅ Email transporter is ready.");
  }
});

const sendOTPEmail = async (toEmail, html, subject = "SmartServe AI - OTP") => {
  const mailOptions = {
    from: `"SmartServeAI" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject,
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`📧 Email successfully sent to ${toEmail}`);
    return true;
  } catch (error) {
    console.error("❌ Error sending email:", error); // Log full error
    return false;
  }
};

module.exports = sendOTPEmail;