var express    =require("express"),
    router     =express.Router({mergeParams:true}),
    Campground =require("../models/campground"),
    Comment     =require("../models/comment"),
    middleware  =require("../middleware");
    

//COMMENTS New
router.get("/new",middleware.isLoggedIn, function(req, res) {
    Campground.findById(req.params.id,function(err,camp){
        if(err)
            console.log(err);
        else
            res.render("comments/new",{campground:camp});
    });
});

//comment create
router.post("/",middleware.isLoggedIn,function(req,res){
    Campground.findById(req.params.id,function(err, camp) {
        if(err)
             req.flash("error","Something went wrong");
        else
        {
            Comment.create(req.body.comment,function(err,comment){
                if(err)
                    console.log("err");
                else
                {
                    comment.author.id=req.user._id;
                    comment.author.username=req.user.username;
                    comment.save();
                    camp.comments.push(comment);
                    camp.save();
                     req.flash("success","Successfully added comment");
                    res.redirect("/campgrounds/"+camp._id);
                }
            });
        }
    });
});

//COMMENTS Edit form get
router.get("/:comment_id/edit",middleware.checkCommentOwnership, function(req, res) {
    Comment.findById(req.params.comment_id ,function(err,comment){
        if(err)
            res.redirect("back");
        else
            res.render("comments/edit",{campId:req.params.id, comment:comment});
    });
});


//comment UPDATE Route
router.put("/:comment_id",middleware.checkCommentOwnership,function(req,res){
 Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function( err,updatedComment){
        if(err)
            res.redirect("back");
        else
            res.redirect("/campgrounds/"+req.params.id);
    });
});


//DELETE COmment Route
router.delete("/:comment_id",middleware.checkCommentOwnership,function(req,res)
{
    Comment.findByIdAndRemove(req.params.comment_id,function(err){
        if(err)
            res.redirect("back");
        else
         {
             req.flash("success","Successfully deleted comment");
            res.redirect("/campgrounds/"+req.params.id);
         }
    });            
    });
    
    
    

    




module.exports=router;