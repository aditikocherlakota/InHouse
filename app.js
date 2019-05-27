var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var Textbook = require("./models/textbook");
var Comment = require("./models/comment");
var User = require("./models/user");
var seedDB = require("./seeds")

//ROUTES
var commentRoutes = require("./routes/comments");
var authRoutes = require("./routes/auth");
var textbookRoutes = require("./routes/textbooks");
var indexRoutes = require("./routes/index");
app.use(indexRoutes);
app.use(textbookRoutes);
app.use(authRoutes);
app.use(commentRoutes);

seedDB();

//PASSPORT CONFIG
app.use(require("express-session")({
    secret: "goodluck",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

mongoose.connect("mongodb://localhost:27017/inhouse", {useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.use(function(req, res, next){
    res.locals.user = req.user;
    next();
});

app.listen(3000, function(){
    console.log("The InHouse server has started!");
});