var Campground=require("../models/campground"),
    Comment  =require("../models/comment");


var middlewareObject={};

middlewareObject.checkCommentOwnership=function(req,res,next)
{
     if(req.isAuthenticated())
    {
        Comment.findById(req.params.comment_id,function(err,foundComment){
            if(err)
                res.redirect("back");
            else{
            if(foundComment.author.id.equals(req.user._id))
            {
                return next();
            }
            else{
                 req.flash("error","You are not authorized to do that");
                  res.redirect("back")
            }
           
            }
        })  
    }
    else
    {
         req.flash("error","You need to be logged In");
        res.redirect("/login");
    }
}



middlewareObject.checkCampgroundOwnership =function (req,res,next)
{
     if(req.isAuthenticated())
    {
        Campground.findById(req.params.id,function(err,foundCampground){
            if(err)
                res.redirect("back");
            else{
                if(foundCampground.author.id.equals(req.user._id))
                {
                    return next();
                }
                else{
                     req.flash("error","You don't have permission");
                   res.redirect("back") 
                }
            }
        })  
    }
    else
    {
        req.flash("error","You need to be logged In");
        res.redirect("/login");
    }
}



middlewareObject.isLoggedIn=function(req,res,next)
{
    if(req.isAuthenticated())
    {
        return next();
    }
    req.flash("error","You need to be logged In")
    res.redirect("/login")
};


module.exports=middlewareObject;