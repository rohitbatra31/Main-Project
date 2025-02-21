const Review = require("../models/reviews.js");
const Listing = require("../models/listing.js");

module.exports.createreview = async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newreview = new Review(req.body.review);
    newreview.author = req.user._id;
    req.flash("success","New review created");
    listing.reviews.push(newreview);
    await newreview.save();
    await listing.save();
    res.redirect(`/listings/${listing._id}`);
}

module.exports.destroyReview = async (req, res) => {
    let { id, reviewId } = req.params;
    req.flash("success","Review Deleted");
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
}