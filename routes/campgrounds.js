var express    =require("express"),
    router     =express.Router(),
    Campground =require("../models/campground"),
    Comment     =require("../models/comment"),
    middleware  =require("../middleware");


//INDEX - Show All Camps
router.get("/",function(req,res){
    
    Campground.find({},function(err,allCampgrounds){
        if(err)
            console.log("error : "+err)
        else
            res.render("campgrounds/index",{campgrounds:allCampgrounds});
    });
})

//CREATE - Add new camp
router.post("/",middleware.isLoggedIn,function(req,res){
    var name=req.body.name;
    var image=req.body.image;
    var price=req.body.price;
    var description=req.body.description;
    var author={
        id:req.user.id,
        username:req.user.username
    }
    var campNew={name:name,price:price,image:image,description:description,author:author};
    //create and save to DB
    Campground.create(campNew,function(err,newlyCampground){
        if(err)
            req.flash("error",err.message);
        else{
            req.flash("success","Campground added successfully");
            res.redirect("campgrounds");
        }
    });
})

//NEW - Display form to add new camp
router.get("/new",middleware.isLoggedIn, function(req, res) {
    res.render("campgrounds/new");
});

//SHOW - display single camp info
router.get("/:id", function(req, res) {
    
     Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampgrounds){
        if(err)
            console.log("error : "+err)
        else{
            // console.log(foundCampgrounds)
            res.render("campgrounds/show",{campgrounds:foundCampgrounds});
        }
    });
});

//Edit Campground Route
router.get("/:id/edit",middleware.checkCampgroundOwnership,function(req, res) {
 
        Campground.findById(req.params.id,function(err,foundCampground)
        {
            if(err)
                 req.flash("error","Campground not found");
            else 
            {
                res.render("campgrounds/edit",{campground:foundCampground});
            }
        })
});

//Update campground
router.put("/:id",middleware.checkCampgroundOwnership,function(req,res){
    Campground.findByIdAndUpdate(req.params.id,req.body.campground,function( err,updatedCamp){
        if(err)
            res.redirect("/campgrounds")
        else{
            req.flash("success","Campground edited successfully");
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
});

//Destroy - Campground Route
router.delete("/:id",middleware.checkCampgroundOwnership,function(req,res){
    Campground.findByIdAndRemove(req.params.id,function(err){
        if(err)
            res.redirect("/campgrounds")
        else
        {   req.flash("success","Campground deleted successfully");
            res.redirect("/campgrounds")
        }
    });
});

module.exports=router;