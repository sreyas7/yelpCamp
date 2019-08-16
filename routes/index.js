var express = require("express"),
router = express.Router(),
User = require("../models/user"),
passport = require("passport"),
middleware = require("../middleware")

router.get("/", (req, res) => {
    res.render("landing")
})

router.get("/register", middleware.isAlreadyLoggedIn, (req, res) => {
    res.render("register")
})

router.post("/register", (req, res) => {
    User.register(new User({ username: req.body.username }), req.body.password, (err, user) => {
        if(err){
            req.flash("error", err.message + "!")
            return res.redirect("/register")
        }
        passport.authenticate("local")(req, res, () => {
            req.flash("success", "Welcome to YelpCamp, " + req.user.username)
            res.redirect("/campgrounds")
        })
    })
})

router.get("/login", middleware.isAlreadyLoggedIn, (req, res) => {
    res.render("login")
})

//proceed only if he is already a registred member
router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), (req, res) => {})

router.get("/logout", (req, res) => {
    req.logout()
    req.flash("success", "You have been logged out!")
    res.redirect("/login")
})

module.exports  = router