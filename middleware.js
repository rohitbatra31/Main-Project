const Listing = require("./models/listing");
const Expresserror = require("./utilis/Expresserror");
const {listingschema, reviewschema} = require("./schema.js")
const Review = require("./models/reviews.js");

module.exports.isloggedin = (req, res, next) => {
    if (!req.isAuthenticated()) {
        // information of path
        req.session.requiredurl = req.originalUrl;  // orginalurl has same path where request has been sent
        req.flash("error", "Please login to continue");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveredirecturl = (req, res, next) => {
    if (req.session.requiredurl) {
        res.locals.redirecturl = req.session.requiredurl;
    }
    next();
}

// module.exports.isowner = async(req,res,next)=>{
//     const {id } = req.params;
//     const listing =await Listing.findById(id);
//     if(!listing.owner.equals(res.locals.curruser._id)){
//         req.flash("error","You are not the owner of the Listing");
//         res.redirect(`/listings/${id}`);
//     }
// next();
// }

module.exports.isowner = async (req, res, next) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing.owner.equals(req.user._id)) {
        req.flash("error", "You do not have permission to do that!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.validateListing = (req, res, next) => {
    const { error } = listingschema.validate(req.body);  // this is schema validation which we gave in schema.js
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new Expresserror(400, msg); // this function will pass as middleware in all requests for validation schema checks
    } else {
        next();
    }
};

module.exports.validatereview = (req, res, next) => {
    const { error } = reviewschema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new Expresserror(400, msg);
    } else {
        next();
    }
};

// module.exports.isauthor = async (req, res, next) => {
//     const { reviewId } = req.params;
//     const review = await Review.findById(reviewId);
//     if (!review.author.equals(res.locals.curruser._id)) {
//         req.flash("error", "You do not have permission to do that!");
//         return res.redirect(`/listings/${id}`);
//     }
//     next();
// }

module.exports.isauthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(res.locals.curruser._id)) {
        req.flash("error", "You are not author of this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
}