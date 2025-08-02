const express = require('express');
const providerRouter = express.Router();

const { verifyProviderToken } = require('../controller/verifyLink');
const { sendProviderLink } = require('../controller/linkController');
const { providerRegister, providerLogin } = require('../controller/providerController');

// 📬 Step 1: Send registration link to provider's email
providerRouter.post("/send-link", sendProviderLink);

// 🔍 Step 2: Verify token before allowing registration (use GET for query params)
providerRouter.get("/verify-token", verifyProviderToken);

// 📝 Step 3: Register provider using token from email
providerRouter.post("/register", providerRegister);

// 🔐 Step 4: Login route for provider
providerRouter.post("/login", providerLogin);

module.exports = providerRouter;
