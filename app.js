var express = require("express"),
passport = require("passport"),
localStrategy = require("passport-local"),
passportLocalMongoose = require("passport-local-mongoose"),
app = express(),
flash = require("connect-flash"),
methodOverride = require("method-override"),
bodyParser = require("body-parser"),
mongoose = require("mongoose"),
User = require("./models/user")

mongoose.connect("mongodb://localhost/yelpcamp", { useNewUrlParser: true })
app.set("view engine", "ejs")
app.use(express.static(__dirname + "/public"))
app.use(bodyParser.urlencoded({extended: true}))
app.use(methodOverride("_method"))
app.use(flash())

var commentRoutes = require("./routes/comments"),
campgroundRoutes = require("./routes/campgrounds"),
indexRoutes = require("./routes/index")

//Passport configuration
app.use(require("express-session")({
    secret: "this is a secret string",
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
passport.use(new localStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) => {
    res.locals.currentUser = req.user
    res.locals.error = req.flash("error")
    res.locals.success = req.flash("success")
    next()
})

//campground routes
app.use("/campgrounds/:id/comments", commentRoutes)
app.use("/campgrounds", campgroundRoutes)
app.use(indexRoutes)

app.listen(3000, "localhost", () => {
    console.log("yelpcamp started...")
})

//handle all other than meaningful routes