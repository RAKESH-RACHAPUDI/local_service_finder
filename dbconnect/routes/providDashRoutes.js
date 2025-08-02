const express = require('express');
const providerDashRouter = express.Router();

// 🔐 Middleware to protect provider dashboard access


// 📊 Dashboard controller
const { getProviderDashboard } = require('../controller/providDashboard');
const { protectProvider } = require('../middlewares/authProviderMiddleware.js');

// ✅ Route: GET dashboard stats
providerDashRouter.get("/", protectProvider,getProviderDashboard);

module.exports = providerDashRouter;