const Joi = require('joi');

module.exports.listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    location: Joi.string().required(),
    country: Joi.string().required(),
    price: Joi.number().required().min(0),
    image: Joi.any(),

    // ✅ Add category field here
    category: Joi.string().valid(
      "Trending",
      "Rooms",
      "Iconic Cities",
      "Mountains",
      "Amazing Pools",
      "Camping",
      "Farms",
      "Arctic",
      "Domes",
      "Boats"
    ).optional()
  }).required()
});

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5),
    comment: Joi.string().required(),
  }).required()
});
