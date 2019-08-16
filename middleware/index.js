var Campground = require("../models/campground"),
Comment = require("../models/comment")

var middlewareObj = {}

middlewareObj.isLoggedIn = function (req, res, next) {
    if(req.isAuthenticated()){
        return next()
    }
    req.flash("error", "You need to login first!")
    res.redirect("/login")
}

middlewareObj.isAlreadyLoggedIn = function (req, res, next) {
    if(!req.isAuthenticated()){
        return next()
    }
    req.flash("success", "You are already logged in!")
    res.redirect("/campgrounds")
}

middlewareObj.isCampgroundAuthorLoggedIn = function (req, res, next) {
    Campground.findById(req.params.id, (err, foundCampground) => {
        if(err){
            req.flash("error", "Something went wrong!")
        } else {
            if(foundCampground.author.id.equals(req.user._id)){
                return next()
            }
            req.flash("error", "You don't have permissions for that!")
            res.redirect("/campgrounds/" + req.params.id)
        }
    })
}

middlewareObj.isCommentAuthorLoggedIn = function (req, res, next) {
    Campground.findById(req.params.id, (err, foundCampground) => {
        if(err){
            req.flash("error", "Something went wrong!")
        } else {
            Comment.findById(req.params.comment_id, (err, foundComment) => {
                if(foundComment.author.id.equals(req.user._id)){
                    return next()
                }
                req.flash("error", "You don't have permissions for that!")
                res.redirect("/campgrounds/" + req.params.id)
            })
        }
    })
}

module.exports = middlewareObj