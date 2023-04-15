const express = require('express');
const http = require('http')
const mongo = require('mongoose'); 
const mongoconnection = require('./config/mongoconnection.json'); 
const bodyParser = require("body-parser");
const cors = require('cors');
const session = require('express-session')




// ====== google auth =============
// require("dotenv").config(); 
// const passport = require("passport"); 
// const cookieSession = require("cookie-session"); 
// const passportSetup = require("./routes/User/passport"); 
// const authRoute = require("./routes/User/auth");


// =========== Database Connection ==============
mongo.connect("mongodb+srv://yosramekaoui:yosra@cluster0.aalwf4q.mongodb.net/ace?retryWrites=true&w=majority"
).then(()=>console.log("Db Connect")).catch((err)=>{
    console.log(err);
});


// ============= configuration express ================
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(session({
  secret: 'azjdn1dkd3ad', // Set a secret key for session encryption
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true if using HTTPS
}));


// ============ routes =================
var useRouter = require('./routes/User/user'); 
var eventRouter = require('./routes/Events/Events');
var associationRouter = require("./routes/Association/Association");

app.use('/user', useRouter); 
app.use('/event',eventRouter);
app.use('/uploads', express.static('uploads'));
app.use('/public/uploads',express.static('public/uploads'));


// ========== Upgrade =================
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));
app.use("/upgrades", express.static("upgrades"));


// ======== association ===============
var assocRouter = require("./routes/Association/Association");
app.use("/association", assocRouter); 


// ======= funding ===================
var fundingRouter = require("./routes/Funding/funding"); 
app.use("/funding", fundingRouter); 

// ======= donation ===================
var donationRouter = require("./routes/Donation/donation"); 
app.use("/donation", donationRouter); 






// =============== google auth ======= 
// app.use(
//   cookieSession({
//     name: "session",
//     keys: ["cyberwolve"],
//     maxAge : 24*60*60*100
//   })
// )


// app.use(passport.initialize()); 
// app.use(passport.session()); 
// app.use("/auth", authRoute); 

 

// ========= server creation =============
const server = http.createServer(app); 
server.listen(3000, () => console.log('server'))


//================//
