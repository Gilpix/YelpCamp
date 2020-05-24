var express     =require("express"),
    app         =express(),
    bodyParser  =require("body-parser"),
    mongoose    =require("mongoose"),
    Campground  =require("./models/campground"),
    Comment     =require("./models/comment"),
    flash       =require("connect-flash"),
    seedDB       =require("./seeds"),
    passport=require("passport"),
    LocalStrategy=require("passport-local"),
    passportLocalMongoose=require("passport-local-mongoose"),
    methodOverride      =require("method-override"),
    User=require("./models/user");
    
    
var indexRoutes         =require("./routes/index"),
    campgroundRoutes    =require("./routes/campgrounds"),
    commentRoutes        =require("./routes/comments")

mongoose.set('useUnifiedTopology', true);
mongoose.connect("mongodb://localhost:/yelp_camp", {useNewUrlParser: true });
app.use(methodOverride("_method"));
app.use(flash());
//seedDB();  //to seed the DB

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Kuldeep is the best",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname+"/public"));
app.set("view engine","ejs");

app.use(function(req,res,next){
    res.locals.currentUser=req.user;
    res.locals.error=req.flash("error");
    res.locals.success=req.flash("success");
    next();
});

app.use("/",indexRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server started...");
})