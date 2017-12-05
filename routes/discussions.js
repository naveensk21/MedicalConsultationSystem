var express = require("express");
var router = express.Router();
var Discussion = require("../models/discussion");
var middleware = require("../middleware");
var geocoder = require ("geocoder");



//INDEX - show all discussions posts  --main pag
router.get("/", function(req, res){
     //condition to see if the query exits
    if(req.query.search){
        //create variable regex out of regular expression and pass return value and plugin flag 'g'
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        
        //key is the name for the search by the title of the discussion post 
         Discussion.find({name: regex}, function(err, allDiscussions){
       if(err){
           console.log(err);
       } else {
          res.render("discussions/index",{discussions:allDiscussions, currentUser: req.user});
       }
    });
    }
    else{
    // Get all discussions from DB
    Discussion.find({}, function(err, allDiscussions){
       if(err){
           console.log(err);
       } else {
          res.render("discussions/index",{discussions:allDiscussions, currentUser: req.user});
       }
    });
    }
});

//CREATE - add new discussion to DB 
router.post("/", middleware.isLoggedIn, function(req, res){
  // get data from form and add to discussion array
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.description;
  var author = {
      id: req.user._id,
      username: req.user.username
  }
  geocoder.geocode(req.body.location, function (err, data) {
    var lat = data.results[0].geometry.location.lat;
    var lng = data.results[0].geometry.location.lng;
    var location = data.results[0].formatted_address;
    var newDiscussion = {name: name, image: image, description: desc, author:author, location: location, lat: lat, lng: lng};
    // Create a new discussion and save to DB
    Discussion.create(newDiscussion, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to discussions page
            console.log(newlyCreated);
            res.redirect("/discussions");
        }
    });
  });
});
    // // get data from form and add to discussions array
    // var name = req.body.name;
    // //var image = req.body.image;
    // var desc = req.body.description;
    // var author={
    //             id: req.user._id,
    //             username: req.user.username
    //             } //create an object
    // var newDiscussion = {name: name, description: desc, author: author}
    // // Create a new discussion and save to DB
    // Discussion.create(newDiscussion, function(err, newlyCreated){
    //     if(err){
    //         console.log(err);
    //     } else {
    //         req.flash("success", "New Discussion Successfully Created")
    //         //redirect back to discussion page
    //         res.redirect("/discussions");
    //     }
    // });



//NEW - show form to create new discussion
router.get("/new", middleware.isLoggedIn, function(req, res){
   res.render("discussions/new"); 
});

// SHOW - shows more info about one discussions
router.get("/:id", function(req, res){
    //find the cdiscussions with provided ID
    Discussion.findById(req.params.id).populate("comments").exec(function(err, foundDiscussion){
        if(err){
            console.log(err);
        } else {
            console.log(foundDiscussion)
            //render show template with that discussion
            res.render("discussions/show", {discussion: foundDiscussion});
        }
    });
});

//EDIT DISCUSSIONS ROUTE - FORM and need update to submit the form
router.get("/:id/edit",middleware.requireAdmin, function(req, res) {
    //check is someone logged in at all?
    Discussion.findById(req.params.id, function(err, foundDiscussion){
        res.render("discussions/edit", {discussion: foundDiscussion});
    });
});

//UPDATE DISCUSSIONS ROUTE
router.put("/:id",middleware.requireAdmin, function (req, res){
    //find and update discussion
    geocoder.geocode(req.body.location, function (err, data) {
    var lat = data.results[0].geometry.location.lat;
    var lng = data.results[0].geometry.location.lng;
    var location = data.results[0].formatted_address;
    var newData = {name: req.body.discussion.name, image: req.body.discussion.image, description: req.body.discussion.description, location: location, lat: lat, lng: lng};
    Discussion.findByIdAndUpdate(req.params.id, {$set: newData}, function(err, discussion){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            req.flash("success","Successfully Updated!");
            res.redirect("/discussions/" + discussion._id);
        }
    });
  });
});

//DESTROY DISCUSSION ROUTE
router.delete("/:id",middleware.requireAdmin, function(req, res){
    Discussion.findByIdAndRemove(req.params.id, function(err){
       if (err){
           res.redirect("/discussions");     
         } else {
             req.flash("succes", "Discussion: " + Discussion.name + " Successfully Deleted");
             res.redirect("/discussions");
         }
    });
});


//only allow a logged in user to add a comment 
//middelware




// function checkDiscussionOwnership (req, res, next){
//     if (req.isAuthenticated()){
//         Discussion.findById(req.params.id, function(err, foundDiscussion){
//         if (err){
//             res.redirect("back");
//         } else {
//         // another if statment to check if the user own the discussion?
//           if(founddicussion.author.id.equals(req.use._id)){
//                 next();
//           } else {
//                 res.redirect("back");
//           }
//         }
//         });
//     } else{
//         res.redirect("back");
//     }
// }

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};


module.exports = router;