var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Textbook = require("./models/textbook");
var Comment = require("./models/comment");
var seedDB = require("./seeds")

seedDB();
mongoose.connect("mongodb://localhost:27017/inhouse", {useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

app.get("/", function(req, res){
    res.render("landing");
});

app.get("/textbooks/new", function(req, res){
    res.render("textbooks/new");
});

app.get("/textbooks", function(req, res){
    Textbook.find({}, function(err, textbooks){
        if(err){
            console.log(err);}
        else {
    res.render("textbooks/index", {textbooks: textbooks});}
    })
});

app.get("/textbooks/:id", function(req, res){
    //find the campground with provided id
    //then render that campground
    Textbook.findById(req.params.id).populate("comments").exec(function(err, foundTextbook){
        if(err){
            console.log(err);
        }
        else {
            res.render("textbooks/show", {textbook: foundTextbook});
        }
    });
})

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
                console.log(textbook);}});

   //redirect back to textbooks page
   res.redirect("textbooks");
});

//==============================================================================
//COMMENTS ROUTES
//==============================================================================

app.get("/textbooks/:id/comments/new", function(req, res){
    Textbook.findById(req.params.id, function(err, textbook){
        if(err){
            console.log(err);
        }
        else {
            res.render("comments/new", {textbook: textbook})
        }
    }) 
});

app.post("/textbooks/:id/comments", function(req, res){
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

app.listen(3000, function(){
    console.log("The InHouse server has started!");
});