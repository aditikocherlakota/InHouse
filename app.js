var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Textbook = require("./models/textbook");
var seedDB = require("./seeds")

seedDB();
mongoose.connect("mongodb://localhost:27017/inhouse", {useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

app.get("/", function(req, res){
    res.render("landing");
});

app.get("/textbooks/new", function(req, res){
    res.render("new.ejs");
});

app.get("/textbooks", function(req, res){
    Textbook.find({}, function(err, textbooks){
        if(err){
            console.log(err);}
        else {
    res.render("index", {textbooks: textbooks});}
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
            res.render("show", {textbook: foundTextbook});
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

app.listen(3000, function(){
    console.log("The InHouse server has started!");
});