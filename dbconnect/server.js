require('dotenv').config({ path: './.env' });
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// 🔌 Import Routers
const loginrouter = require('./routes/loginrouter');
const dashboardRouter = require('./routes/dashboardRoute');
const otprouter = require('./routes/otpRoutes');
const providerRouter = require('./routes/ProviderRoutes'); 
const providerDashRouter = require('./routes/providDashRoutes');
const userRouter = require('./routes/userRouter');
const AIrouter = require('./routes/serviceProvidersRoutes');
const Bookingrouter = require('./routes/BookingRoute');

const app = express();

// ✅ Connect MongoDB
connectDB();

// 🔐 Middlewares
app.use(cors({
  origin: "http://localhost:5173",
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json());

// ✅ Default Test Route
app.get("/", (req, res) => {
  res.send("✅ SmartServeAI Backend is Running Successfully");
});

// 👤 User Routes
app.use("/api/users", userRouter);
app.use("/api/auth", loginrouter);
app.use("/api/user", dashboardRouter);
app.use("/api/otp", otprouter);

// 👨‍🔧 Provider Routes
app.use("/api/provider", providerRouter);
app.use("/api/provider/dashboard", providerDashRouter);

// 🧠 AI Service Route
app.use("/api", AIrouter);  // 👈 use the path `/api/service`
// booking Routes
app.use("/api/bookings",Bookingrouter)

// ❗404 Fallback (Keep this **after** all routes)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "❌ API Route Not Found"
  });
});

// ❗Global Error Handler
app.use((err, req, res, next) => {
  console.error("🔴 Internal Server Error:", err.stack);
  res.status(500).json({
    success: false,
    message: "🚨 Something went wrong on the server"
  });
});

// 🚀 Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 SmartServeAI backend running at http://localhost:${PORT}`);
});