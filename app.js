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
var commentRoutes = require("./routes/comments");

seedDB();

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

app.get("/", function(req, res){
    res.render("landing", {user: req.user});
});

app.get("/textbooks/new", function(req, res){
    res.render("textbooks/new");
});

app.get("/textbooks", function(req, res){
    Textbook.find({}, function(err, textbooks){
        if(err){
            console.log(err);}
        else {
    res.render("textbooks/index", {textbooks: textbooks});
    }
});
});

app.get("/textbooks/:id", function(req, res){
    Textbook.findById(req.params.id).populate("comments").exec(function(err, foundTextbook){
        if(err){
            console.log(err);
        }
        else {
            res.render("textbooks/show", {textbook: foundTextbook});
        }
    });
});

app.post("/textbooks", function(req, res){
    var title = req.body.title;
    var image = req.body.img;
    var description = req.body.description;
    var newTextbook = {title: title, image: image, description: description}
    Textbook.create(newTextbook,
        function(err, textbook){
            if (err) {
                console.log(err);}
            else{
                console.log("newly created textbook:");
                console.log(textbook);
            }});

   //redirect back to textbooks page
   res.redirect("textbooks");
});

// ==============================================================================
// COMMENTS ROUTES
// ==============================================================================

app.get("/textbooks/:id/comments/new", isLoggedIn, function(req, res){
    Textbook.findById(req.params.id, function(err, textbook){
        if(err){
            console.log(err);
        }
        else {
            res.render("comments/new", {textbook: textbook})
        }
    }) 
});

app.post("/textbooks/:id/comments", isLoggedIn, function(req, res){
    Textbook.findById(req.params.id, function(err, textbook){
        Comment.create(req.body.comment, function(err, comment){
            if(err){
                console.log(err);
                res.redirect("/textbooks");
            }
            else{
                textbook.comments.push(comment);
                textbook.save();
                res.redirect("/textbooks/" + textbook._id);

            }
        });});});

//Register Form
app.get("/register", function(req, res){
    res.render("register");
});

app.post("/register", function(req, res){
    User.register(new User({username: req.body.username}), req.body.password,
        function(err, user){
            if(err){
                console.log(err);
                return res.render('register');
            }
                passport.authenticate("local")(req, res, function(){
                res.redirect("/textbooks");
            });
        });
});

app.get("/login", function(req, res){
    res.render("login");
});

app.post("/login", passport.authenticate("local", {
    failureRedirect: "/login"
}),
    function(req, res){
    res.redirect(req.session.returnTo || '/');
    delete req.session.returnTo;
}); 

app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/textbooks");
}); 

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.session.returnTo = req.originalUrl;
    res.redirect("/login");
}

app.listen(3000, function(){
    console.log("The InHouse server has started!");
});