const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

module.exports.createReview = async (req, res, next) => {
        const { id } = req.params;
        const listing = await Listing.findById(id);
        const newReview = new Review(req.body.review);
        newReview.author = req.user._id;
        listing.reviews.push(newReview);
        await newReview.save();
        await listing.save();

        console.log("✅ New review saved");
         req.flash("success","review created");
        res.redirect(`/listings/${id}`);

}

module.exports.destroyReview = async(req,res)=>{
    let{id,reviewId} = req.params;

    await Review.findByIdAndDelete(reviewId);
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
     req.flash("success","review deleted!");
    res.redirect(`/listings/${id}`);
}
