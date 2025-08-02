const express = require("express");
const AIrouter = express.Router();

const { getProvider } = require("../controller/serviceProvidersController");

AIrouter.post("/service", getProvider);

module.exports = AIrouter;