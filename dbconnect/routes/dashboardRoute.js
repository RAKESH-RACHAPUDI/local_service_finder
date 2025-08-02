const express = require("express");
const authMiddleware = require("../middlewares/authmiddlewares");

const dashboardRouter = express.Router();

// 🔐 Protected route
dashboardRouter.get("/protected", authMiddleware, (req, res) => {
  res.json({ 
    message: `Welcome ${req.user.name}, you are authenticated!`,
    user: {
      name: req.user.name,
      email: req.user.email
    }
  });
});

module.exports =  dashboardRouter;
