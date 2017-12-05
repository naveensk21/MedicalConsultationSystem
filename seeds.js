var mongoose = require("mongoose");
var Discussion = require("./models/discussion");
var Comment   = require("./models/comment");

var data = [
    {
        name: "Dr. Stephens", 
        image: "",
        description: "Lorem ipsum random text text text Lorem ipsum random text text text Lorem ipsum random text text text Lorem ipsum random text text text llamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    },
    {
        name: "Dr.Andy", 
        image: "",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmLorem ipsum random text text text Lorem ipsum random text text text Lorem ipsum random text text text Lorem ipsum random text text text  aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    },
    {
        name: "Dr.Stewart", 
        image: "",
        description: "Lorem ipsum random text text text Lorem ipsum random text text text Lorem ipsum random text text text Lorem ipsum random text text text "
    }
]

function seedDB(){
   //Remove all discussion 
   Discussion.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed Discussion!");
         //created new dicussion to ensure that new discussion is created on the page for testing 
        data.forEach(function(seed){
            Discussion.create(seed, function(err, discussion){
                if(err){
                    console.log(err)
                } else {
                    console.log("created a discussion");
                    //create a comment
                    Comment.create(
                        {
                            text: "Amazing Doctor",
                            author: "Naveen"
                        }, function(err, comment){
                            if(err){
                                console.log(err);
                            } else {
                                discussion.comments.push(comment);
                                dicussion.save();
                                console.log("Added new comment");
                            }
                        });
                }
            });
        });
    }); 
}

module.exports = seedDB;
