const express = require("express");
const router = express.Router(); // router object
const { isloggedin, isowner, validateListing } = require("../middleware.js");
const listingcontroller = require("../controller/listing.js");
const multer = require('multer');
const { storage } = require("../cloudinary.js");
const upload = multer({ storage }); // uploading in storage which have exported

// Index route
router.route("/")
    .get(listingcontroller.index)
    .post(isloggedin, upload.single('listing[image]'),validateListing, listingcontroller.createListing);

// New route
router.get("/new", isloggedin, listingcontroller.rendernewform);

// Show and update
router.route("/:id")
    .get(listingcontroller.showListing)
    .put(isloggedin, isowner, upload.single('listing[image]'), validateListing, listingcontroller.updateListings)
    .delete(isloggedin, isowner, listingcontroller.destroylisting);

// Edit route
router.get("/:id/edit", isloggedin, isowner, listingcontroller.rendereditform);

module.exports = router;