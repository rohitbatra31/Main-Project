const express = require("express");
const router = express.Router(); 
const User = require("../models/user.js");
const Wrapasync = require("../utilis/Asncwrap.js");
const passport = require("passport");
const { saveredirecturl } = require("../middleware.js");
const usercontroller = require("../controller/user.js");


router
.route("/signup")
.get(usercontroller.rendersignupform)           //concatendated all requests coming for same route together with router.route
.post(Wrapasync(usercontroller.signup))

router.route("/login")
.get(usercontroller.renderloginform)
.post(saveredirecturl, passport.authenticate('local', { failureRedirect: '/login' ,failureFlash : true}), usercontroller.login)



router.get("/logout", usercontroller.logout)




module.exports = router;