if(process.env.NODE_ENV!="production")
    {require('dotenv').config()

    } 
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsmate = require("ejs-mate");
const Wrapasync = require("./utilis/Asncwrap.js");
const Expresserror = require("./utilis/Expresserror");
const listingrouter = require("./routes/listing.js")
const reviewsrouter = require("./routes/review.js")
const userrouter = require("./routes/user.js")
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const pasport = require("passport")
const Localstrategy = require("passport-local");
const User = require("./models/user.js");
const port = process.env.PORT || 8080;



app.listen(port, (err) => {
    if (err) {
        console.error("Failed to start server:", err);
        return;
    }
    console.log(`Server started on Port: ${port}`);
});

const dburl = process.env.ATLAS_DB_URL;
async function main()
{
    await mongoose.connect(dburl);
    }

    main().then(()=>
    {
        console.log("Connected to database");
    }).catch(err => console.log(err));

    app.set("view engine", "ejs");
    app.set("views",path.join(__dirname,"views"));
    app.use(express.urlencoded({extended:true}));
    app.use(methodOverride("_method"));
    app.engine("ejs",ejsmate);
    app.use(express.static(path.join(__dirname,"/public")));


const store = MongoStore.create({
    mongoUrl : dburl,
    crypto:{
        secret : process.env.SECRET,
    },
    touchafter : 24*3600,
})

store.on("error",()=>{
    console.log("some error occured",err); // if any error happens at mongo end in mongo sessio store
})


    const sessionoption = {
        store,
        secret :process.env.SECRET,
        resave : false,
        saveUninitialized :true,
        cookie :{                    //stores in inspect application cookie
            expires : Date.now() +7*24*60*60*1000,    // cookie was made for seesion for 1 wek the number is 7days 24 hour 60min 60sec 1000ms same for maxage
            maxAge : 7*24*60*60*1000,
            httpOnly : true  //for security
        }
    }

    app.use(session(sessionoption));   // calling here as it is a middleware
    app.use(flash());  // always make this before routes
    app.use(pasport.initialize());  // passport initalize
   app.use(pasport.session());   // passport use sessions
   pasport.use(new Localstrategy(User.authenticate()));  // created authenticate for model user
   pasport.serializeUser(User.serializeUser());
   pasport.deserializeUser(User.deserializeUser());
   



    app.use((req,res,next)=>{
        res.locals.success = req.flash("success");  //key value pair made key here 
        res.locals.error = req.flash("error");                     // middleware made for flash function
        res.locals.curruser = req.user;                     // middleware made for flash function
        next();
    })

    
app.use("/listings", listingrouter); // where ever listings will come wwe will use listings which we have required
app.use("/listings/:id/reviews",reviewsrouter)  // re structured for reviews also in same manner under routes folder
app.use("/",userrouter)



//root directory
// app.get("/",Wrapasync((req,res)=>{
//     res.send("Hi I am root");
// }));

// Catch-all route erros 
app.all("*",(req,res,next)=>{
    next(new Expresserror(404,"Page not found"));
   // throw new Expresserror(404,"Page not found")
 })

//Middleware to handle error
app.use((err, req, res, next) => {
    const { statuscode = 500, message = "Something went wrong" } = err;
    console.error(message); // Log only the error message
   // res.status(statuscode).send(message);
   res.status(statuscode).render("./listings/error.ejs",{message});
});

