// YelpCamp application

// REQUIREMENTS
var express         =    require('express'),
    app             =    express(),
    bodyParser      =    require("body-parser"),
    mongoose        =    require("mongoose"),
    flash           =    require("connect-flash"),
    passport        =    require("passport"),
    LocalStrategy   =    require("passport-local"),
    methodOverride  =    require("method-override"),
    User            =    require("./models/user"),
    seedDB          =    require("./seeds");

var commentRoutes     = require("./routes/comments"),
    campgroundRoutes  = require("./routes/campgrounds"),
    indexRoutes       = require("./routes/index");


var url = process.env.DATABASEURL || "mongodb://localhost:27017/yelp_camp"
mongoose.connect(url, { useNewUrlParser: true });

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
//seedDB();

// Passport configuration
app.use(require("express-session")({
    secret: "adonias secret-key",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// middleware for passing user information to views
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

// requiring routes
app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

// server listening
app.listen(process.env.PORT,function(){
    console.log('YelpCamp server has started!');
});