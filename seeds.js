var mongoose = require("mongoose");
var Textbook = require("./models/textbook");
var Comment = require("./models/comment");

var err = 
    function (msg, action){
        return function(err, obj){
            if(err){
                console.log(err);
            }
            else {
                action(obj);
                //console.log(msg);
            }
        }
    }


var data = [
    { "title" : "CLRS", "image" : "https://images-na.ssl-images-amazon.com/images/I/41-1VkO%2B1lL._SX359_BO1,204,203,200_.jpg", "description" : "The latest edition of the essential text and professional reference, with substantial new material on such topics as vEB trees, multithreaded algorithms, dynamic programming, and edge-based flow.\n\nSome books on algorithms are rigorous but incomplete; others cover masses of material but lack rigor. Introduction to Algorithms uniquely combines rigor and comprehensiveness. The book covers a broad range of algorithms in depth, yet makes their design and analysis accessible to all levels of readers. Each chapter is relatively self-contained and can be used as a unit of study. The algorithms are described in English and in a pseudocode designed to be readable by anyone who has done a little programming. The explanations have been kept elementary without sacrificing depth of coverage or mathematical rigor.\n\nThe first edition became a widely used text in universities worldwide as well as the standard reference for professionals. The second edition featured new chapters on the role of algorithms, probabilistic analysis and randomized algorithms, and linear programming. The third edition has been revised and updated throughout. It includes two completely new chapters, on van Emde Boas trees and multithreaded algorithms, substantial additions to the chapter on recurrence (now called “Divide-and-Conquer”), and an appendix on matrices. It features improved treatment of dynamic programming and greedy algorithms and a new notion of edge-based flow in the material on flow networks. Many exercises and problems have been added for this edition. The international paperback edition is no longer available; the hardcover is available worldwide."
    },
    {"title" : "Linear Algebra and Its Applications", "image" : "https://images-na.ssl-images-amazon.com/images/I/51DwrFPH2uL._SX398_BO1,204,203,200_.jpg", "description" : "Comprehensive approach to study of linear algebra."
    },
    {"title" : "comp15", "image" : "https://images-na.ssl-images-amazon.com/images/I/51OBer7pDAL._SX398_BO1,204,203,200_.jpg", "description" : "Thoroughly written text on fundamentals of computer science"
    }
]

var comment1 = {
    text: "Pages slightly marked up, but great condition.",
    author: "John Z"
}

function seedDB(){
    Textbook.deleteMany({}, err("Textbook removed!", function(o){
        Comment.deleteMany({}, err("Comment Removed!", function(o){
            data.forEach(function(seed){
                Textbook.create(seed, err("Textbook created!", function(textbook){
                    Comment.create(comment1, err("created new comment!", function(comment){
                        textbook.comments.push(comment);
                        textbook.save();
                    }))
                }))
            })
        }));
    }));
}

module.exports = seedDB;
