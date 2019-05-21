var mongoose = require("mongoose");

var textbook_schema = new mongoose.Schema({
    title: String,
    image: String,
    description: String,
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }]
});

var Textbook = mongoose.model("Textbook", textbook_schema);

module.exports = Textbook;