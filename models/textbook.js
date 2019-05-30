var mongoose = require("mongoose");

var textbook_schema = new mongoose.Schema({
    title: String,
    image: String,
    description: String,
    author: {
        id : {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }],
    modified: {type: Date, default: Date.now} 
});

var Textbook = mongoose.model("Textbook", textbook_schema);

module.exports = Textbook;