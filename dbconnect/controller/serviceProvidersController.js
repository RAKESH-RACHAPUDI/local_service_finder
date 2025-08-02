const OpenAI = require('openai');
const ServiceProvider = require("../model/servicesproviders");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const getProvider = async (req, res) => {
  console.log("✅ /api/service route HIT");

  const { query, location } = req.body;

  // ✅ Step 1: Validate input
  if (!query || typeof query !== 'string') {
    return res.status(400).json({ success: false, message: "❗Query is required and must be a string" });
  }

  try {
    // ✅ Step 2: Ask OpenAI to suggest a service category
    const aiResponse = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are an assistant for a local services app. Based on the user query, suggest a service category like Plumber, Electrician, etc., and provide a brief description. 
Respond in this format ONLY:
Category: <category>
Description: <description>`,
        },
        {
          role: 'user',
          content: query,
        },
      ],
    });

    const aiText = aiResponse.choices[0]?.message?.content?.trim() || "";
    console.log("🔍 AI Raw Response:\n", aiText);

    // ✅ Step 3: Extract Category and Description from AI response
    const match = aiText.match(/Category:\s*(.+)\nDescription:\s*(.+)/i);
    let category, description;

    if (match && match.length >= 3) {
      category = match[1].trim();
      description = match[2].trim();
    } else {
      return res.status(400).json({
        success: false,
        message: "⚠️ AI response format invalid",
        aiText,
      });
    }

    // ✅ Step 4: Build search query with optional location filter
    const searchQuery = { category };

    if (location && typeof location === 'string') {
      searchQuery.location = { $regex: new RegExp(location, "i") }; // case-insensitive search
    }

    const providers = await ServiceProvider.find(searchQuery)
      .sort({ rating: -1 })
      .limit(5);

    // ✅ Step 5: Send JSON Response
    res.json({
      success: true,
      category,
      description,
      providers,
    });

  } catch (error) {
    console.error("🔥 AI or DB Error:", error.message);
    res.status(500).json({ 
      success: false, 
      message: "❌ Internal Server Error", 
      error: error.message 
    });
  }
};

module.exports = { getProvider };
