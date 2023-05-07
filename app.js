const express = require('express');
const http = require('http')
const mongo = require('mongoose'); 
const mongoconnection = require('./config/mongoconnection.json'); 
const bodyParser = require("body-parser");
const cors = require('cors');

const session = require('express-session');
const {Configuration,OpenAIApi}=require("openai")

// ====== google auth =============
// require("dotenv").config(); 
// const passport = require("passport"); 
// const cookieSession = require("cookie-session"); 
// const passportSetup = require("./routes/User/passport"); 
// const authRoute = require("./routes/User/auth");

const path = require("path");
const paymentRoutes=require("./routes/Marketplace/payment");
const scrapRoutes=require("./routes/articlesScrapRoutes");





// =========== Database Connection ==============
mongo.connect("mongodb+srv://yosramekaoui:yosra@cluster0.aalwf4q.mongodb.net/ace?retryWrites=true&w=majority"
).then(()=>console.log("Db Connect")).catch((err)=>{
    console.log(err);
});

// mongo.connect(mongoconnection.url, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// }).then(() => {
//     console.log("DataBase Connected");
// }).catch((err) => {
//     console.log(err);
// });



// ============= configuration express ================
var app = express();
app.set("views" , path.join(__dirname, "views"));
app.set("view engine", "twig");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(session({
  secret: 'azjdn1dkd3ad', // Set a secret key for session encryption
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true if using HTTPS
}));

app.use('/public', express.static(path.join(__dirname, 'public')));

// ============ routes =================
var useRouter = require('./routes/User/user'); 
var eventRouter = require('./routes/Events/Events');
var associationRouter = require("./routes/Association/Association");

app.use('/user', useRouter); 
app.use('/event',eventRouter);
app.use(express.static("public"));
app.use(express.static('uploads'));
app.use('/public/uploads',express.static('public/uploads'));
app.use(express.static('public/audio'));


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


var productRouter = require('./routes/Marketplace/product'); 
app.use('/product', productRouter);
var cartRouter = require('./routes/Marketplace/cart'); 
app.use('/', cartRouter);
var orderRouter = require('./routes/Marketplace/order'); 
app.use('/', orderRouter);
var couponRouter = require('./routes/Marketplace/coupon'); 
app.use('/coupon', couponRouter);
app.use('/payment',paymentRoutes);
app.use('/scrap',scrapRoutes);
app.use(express.static('public'));

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));



//======= podcast ====///
var podcastRouter = require('./routes/Podcast/podcast');
app.use('/podcast', podcastRouter);




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


 




//============= router Publication =================

var PublicationRouter = require('./routes/Publications/Publication'); 
app.use('/publication', PublicationRouter); 


//============= router Publication =================
var CommnetRouter = require('./routes/Publications/comment'); 
app.use('/comment', CommnetRouter); 





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


// ============= MEET CALL =====================
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  socket.emit("me", socket.id);

  socket.on("disconnect", () => {
    socket.broadcast.emit("callEnded");
  });

  socket.on("callUser", ({ userToCall, signalData, from, name }) => {
    io.to(userToCall).emit("callUser", { signal: signalData, from, name });
  });

  socket.on("answerCall", (data) => {
    io.to(data.to).emit("callAccepted", data.signal);
  });
});




server.listen(3000, () => console.log('server'))

//============= router Pet =================
// Serve static files from the "uploads" directory
app.use(express.static('public')); 
app.use('/uploads', express.static('uploads'));
var petRouter = require('./routes/Pet/pet'); 
// endpoint for chatGpt 
const config=new Configuration({
  apiKey:"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",
})
const openai=new OpenAIApi(config);


app.post("/chat",async(req,res)=>{
  const {prompt}=req.body;
  console.log(prompt)
  const completion =await openai.createCompletion({
    model:"text-davinci-003",
    max_tokens:512,
    temperature:0,
    prompt:prompt,
  });
  res.send(completion.data.choices[0].text); 
})
app.use('/pet', petRouter); 

