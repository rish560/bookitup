const axios = require("axios");

module.exports.generateItinerary = async (req, res) => {
  const { location, days } = req.body;

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: `Create a ${days}-day travel itinerary for ${location}. Format it with day-wise bullet points.`
          }
        ],
        max_tokens: 1500 
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:8080",
          "X-Title": "BookItUp"
        }
      }
    );

    const itinerary = response.data.choices[0].message.content;
    res.render("ai/itinerary", { itinerary, location, days });

  } catch (err) {
    console.error("=== AI Error Details ===");
    console.error("Status:", err.response?.status);
    console.error("Error Data:", JSON.stringify(err.response?.data, null, 2));
    console.error("Message:", err.message);
    console.error("========================");
    
    const errorMsg = err.response?.data?.error?.message || err.message || "Unknown error";
    req.flash("error", `AI failed to generate itinerary: ${errorMsg}`);
    res.redirect("/listings");
  }
};
