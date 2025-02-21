const Listing = require("../models/listing.js");
const Wrapasync = require("../utilis/Asncwrap.js");

module.exports.index = Wrapasync(async (req, res) => {
    const alllistings = await Listing.find();
    res.render("./listings/index.ejs", { alllistings });
});

module.exports.rendernewform = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.showListing = Wrapasync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate({
        path: "reviews",
        populate: { path: "author" }
    }).populate("owner");
    if (!listing) {
        req.flash("error", "Listing you are trying to access does not exist");
        return res.redirect("/listings");
    }
    res.render("./listings/show.ejs", { listing });
});

module.exports.rendereditform = Wrapasync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you are trying to access does not exist");
        return res.redirect("/listings");
    }
let orginalurl = listing.image.url;
orginalurl = orginalurl.replace("/upload","/upload/h_300,w-250");

    res.render("listings/edit.ejs", { listing,orginalurl });
});

module.exports.createListing = Wrapasync(async (req, res) => {
   let url  = req.file.path;
   let filename = req.file.filename
    console.log(url,"..", filename );
    req.flash("success", "Listing added successfully");
    const newlisting = new Listing(req.body.listing);
    newlisting.image = { url,filename };
    newlisting.owner = req.user._id;
    await newlisting.save();
    res.redirect("/listings");
});

module.exports.updateListings = Wrapasync(async (req, res) => {
    const { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { new: true });
     if (!listing) {
        req.flash("error", "Listing you are trying to update does not exist");
        return res.redirect("/listings");
    }
    if(typeof req.file !=="undefined"){
    let url  = req.file.path;
   let filename = req.file.filename
   listing.image = { url,filename };
   listing.save();}
    req.flash("success", "Listing updated successfully");
    res.redirect(`/listings/${id}`);
});

module.exports.destroylisting = Wrapasync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findByIdAndDelete(id);
    if (!listing) {
        req.flash("error", "Listing you are trying to delete does not exist");
        return res.redirect("/listings");
    }
    req.flash("success", "Listing deleted successfully");
    res.redirect("/listings");
});