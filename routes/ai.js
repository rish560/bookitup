const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middleware.js");
const aiController = require("../controllers/ai.js");

router.get("/travel", isLoggedIn, (req, res) => {
  res.render("ai/form");
});

router.post("/travel", isLoggedIn, aiController.generateItinerary);

module.exports = router;
