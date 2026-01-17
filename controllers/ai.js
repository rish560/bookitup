const axios = require("axios");

module.exports.generateItinerary = async (req, res) => {
  const { location, days } = req.body;

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "meta-llama/llama-3.1-8b-instruct:free",
        messages: [
          {
            role: "user",
            content: `Create a ${days}-day travel itinerary for ${location}. Format it with day-wise bullet points.`
          }
        ],
        max_tokens: 1000 
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
    console.error("AI Error:", err.response?.data || err.message);
    req.flash("error", "AI failed to generate itinerary.");
    res.redirect("/listings");
  }
};
