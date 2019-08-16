var express = require("express"),
router = express.Router(),
Campground = require("../models/campground")
middleware = require("../middleware")

router.get("/", (req, res) => {
    Campground.find({}, (err, allCampgrounds) => {
        if(err){
            req.flash("error", "Something went wrong!")
        } else{
            res.render("campgrounds/index", { campgrounds: allCampgrounds })
        }
    })
})

router.get("/new", middleware.isLoggedIn, (req, res) => {
    res.render("campgrounds/new");
})

router.get("/:id", (req, res) => {
    Campground.findById(req.params.id).populate("comments").exec((err, foundCampground) => {
        if(err){
            req.flash("error", "Campground not found!")
            res.redirect("/campgrounds")
        } else {
            res.render("campgrounds/show", { campground: foundCampground })
        }
    })
})

router.post("/", middleware.isLoggedIn, (req, res) => {
    Campground.create({
        name: req.body.name, 
        image: req.body.image,
        description: req.body.description,
        author: {
            id: req.user._id,
            username: req.user.username
        }
    }, (err, newCampground) => {
        if(err){
            req.flash("error", "Something went wrong!")
        } else{}
    })
    req.flash("success", "Campground successfully added!")
    res.redirect("/campgrounds")
})

router.get("/:id/edit", middleware.isLoggedIn, middleware.isCampgroundAuthorLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
        if(err){
            req.flash("error", "Something went wrong!")
            res.redirect("/campgrounds/" + req.params.id)
        } else {
            res.render("campgrounds/edit", { campground: foundCampground })
        }
    })
})

router.put("/:id", middleware.isLoggedIn, middleware.isCampgroundAuthorLoggedIn, (req, res) => {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground) => {
        if(err){
            req.flash("error", "Something went wrong!")
        } else {
            req.flash("success", "Campground has been updated successfully!")
        }
        res.redirect("/campgrounds/" + req.params.id)
    })
})

router.delete("/:id", middleware.isLoggedIn, middleware.isCampgroundAuthorLoggedIn, (req, res) => {
    Campground.findByIdAndRemove(req.params.id, (err) => {
        if(err){
            req.flash("error", "Something went wrong!")
        } else {
            req.flash("success", "Campground successfully deleted!")
        }
        res.redirect("/campgrounds")
    })
})

module.exports = router

