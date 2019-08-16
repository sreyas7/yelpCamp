var express = require("express"),
router = express.Router({ mergeParams: true }),
Campground = require("../models/campground"),
Comment = require("../models/comment"),
middleware = require("../middleware")

router.get("/new", middleware.isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
        res.render("comments/new", { campground: foundCampground })
    })
})

router.post("/", middleware.isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
        if(err){
            req.flash("error", "Something went wrong!")
        } else {
            Comment.create(req.body.comment, (err, comment) => {
                if(err){
                    req.flash("error", "Something went wrong!")
                } else {
                    comment.author.id = req.user._id
                    comment.author.username = req.user.username
                    comment.save()
                    foundCampground.comments.push(comment)
                    foundCampground.save()
                    req.flash("success", "Comment added successfully!")
                }
            })
        }
        res.redirect("/campgrounds/" + req.params.id)
    })
})

router.get("/:comment_id/edit", middleware.isCommentAuthorLoggedIn, (req, res) => {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
        res.render("comments/edit", { comment: foundComment, campground_id: req.params.id })
    })
})

router.put("/:comment_id", middleware.isCommentAuthorLoggedIn, (req, res) => {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {
        if(err){
            req.flash("error", "Something went wrong!")
        } else {
            req.flash("success", "Comment updated successfully!")
        }
        res.redirect("/campgrounds/" + req.params.id)
    })
})

router.delete("/:comment_id", middleware.isCommentAuthorLoggedIn, (req, res) => {
    Comment.findByIdAndRemove(req.params.comment_id, (err) => {
        if(err){
            req.flash("error", "Something went wrong!")
        } else {
            req.flash("success", "Comment successfully deleted!")
        }
        res.redirect("/campgrounds/" + req.params.id)
    })
})

module.exports = router