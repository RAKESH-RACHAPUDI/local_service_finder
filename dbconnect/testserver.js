const express = require('express');
const app = express();

app.use(express.json());

// ✅ Test Route with Dynamic Parameter
app.post("/register/:token", (req, res) => {
  const { token } = req.params;
  res.status(200).json({
    message: "✅ Token received successfully",
    token,
  });
});

// 🚀 Start Server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🧪 Test server running at http://localhost:${PORT}`);
});