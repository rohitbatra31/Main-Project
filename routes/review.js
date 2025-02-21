const express = require("express");
const router = express.Router({ mergeParams: true }); // mergeParams to access :id from parent route
const Wrapasync = require("../utilis/Asncwrap.js");
const Expresserror = require("../utilis/Expresserror");
const {validatereview, isloggedin, isauthor}= require("../middleware.js")
const Review = require("../models/reviews.js");
const Listing = require("../models/listing.js");
const reviewcontroller = require("../controller/review.js");




// Post reviews route
router.post("/", isloggedin,validatereview,Wrapasync(reviewcontroller.createreview ));  // we should write this in between wrapsync in listing.js it was from github good practice is to write under wrapasnc

// Delete reviews route
router.delete("/:reviewId",isloggedin,isauthor, Wrapasync(reviewcontroller.destroyReview));

module.exports = router;