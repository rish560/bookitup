if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}


const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride= require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const aiRouter = require("./routes/ai.js");



const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

app.engine("ejs",ejsMate);
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"/public")));

const dbUrl = process.env.ATLASDB_URL;

main()
.then((res)=>{
    console.log("connected to db");
}).catch((err)=>{
    console.error("Database connection error:",err);
    process.exit(1);
});
async function main(){
  try {
    await mongoose.connect(dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("✅ Connected to MongoDB Atlas");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1); // Exit so you don't start the server without DB
  }
}
;

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
    secret: process.env.SECRET,
  },
  touchAfter:24*3600,

})

const sessionOptions = {
    store,
    secret:process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires: Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    },

}

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser= req.user;
    next();
});



app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/", userRouter);
app.use("/ai", aiRouter);

app.get("/", (req, res) => {
  res.redirect("/listings"); 
});

app.use( (req,res,next) => {
    next(new ExpressError(404,"Page not found!"));
});
app.use((err,req,res,next)=>{
    let{status=500, message="Something went wrong!"} = err;
    res.status(status).render("listings/error.ejs",{err});
});


app.listen(8080,(req,res)=>{
    console.log("app is listening to server 8080");
});
