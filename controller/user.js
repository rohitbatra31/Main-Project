const User = require("../models/user.js");

module.exports.rendersignupform = (req, res) => {
    res.render("users/signup.ejs");
}

module.exports.signup = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newuser = new User({ email, username });
        const registereduser = await User.register(newuser, password);
        req.login(registereduser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to WanderLust");
            res.redirect("/listings");
        });
    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/signup"); // stay on the same page and reflect flash message
    }
}

module.exports.renderloginform = (req, res) => {
    res.render("users/login.ejs");
}

module.exports.login = async (req, res) => {
    req.flash("success", "Welcome back to WanderLust");
    let redirecturl = res.locals.redirecturl || "/listings"; // if we have a redirect value, go to the appropriate page, else go to listings
    res.redirect(redirecturl);
}

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You are logged out now");
        res.redirect("/listings");
    });
}