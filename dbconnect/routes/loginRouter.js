const express = require("express");
const loginrouter = express.Router();

const { login } = require("../controller/userControllers");
const authMiddleware = require("../middlewares/authmiddlewares");


// Login route
loginrouter.post("/login", login);

// Protected route
loginrouter.get("/protected", authMiddleware, (req, res) => {
  res.status(200).json({
    message: "Protected route accessed",
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
    }
  });
});

module.exports = loginrouter;
