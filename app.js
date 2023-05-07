const express = require('express');
const http = require('http')
const mongo = require('mongoose'); 
const mongoconnection = require('./config/mongoconnection.json'); 
const bodyParser = require("body-parser");
const cors = require('cors');

const session = require('express-session');
const {Configuration,OpenAIApi}=require("openai")
const axios = require('axios');

// ====== google auth =============
// require("dotenv").config(); 
// const passport = require("passport"); 
// const cookieSession = require("cookie-session"); 
// const passportSetup = require("./routes/User/passport"); 
// const authRoute = require("./routes/User/auth");

const path = require("path");
const paymentRoutes=require("./routes/Marketplace/payment");
const CHAT_ENGINE_PROJECT_ID = "bccb6fcd-364e-424e-934a-1c8cd591efaa";
const CHAT_ENGINE_PRIVATE_KEY = "e057975e-54d5-44a8-9a78-1fa71c1967a4";


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
app.use(cors({
  origin: '*'
}));
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
app.use(express.static("public"));
app.use(express.static('uploads'));
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


var productRouter = require('./routes/Marketplace/product'); 
app.use('/product', productRouter);
var cartRouter = require('./routes/Marketplace/cart'); 
app.use('/', cartRouter);
var orderRouter = require('./routes/Marketplace/order'); 
app.use('/', orderRouter);
var couponRouter = require('./routes/Marketplace/coupon'); 
app.use('/coupon', couponRouter);
app.use('/payment',paymentRoutes);
app.use(express.static('public'));









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
server.listen(3000, () => console.log('server'))


//================//

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

app.post("/description",async(req,res)=>{
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
const animalKeywords = ["cat", "dog", "pet", "animal", "puppy", "kitten", "hamster", "rabbit", "fish","hi"];

app.post("/chat", async (req, res) => {
  const { prompt } = req.body;

  // check if prompt contains any animal keywords
  const containsKeyword = animalKeywords.some((keyword) =>
    prompt.toLowerCase().includes(keyword)
  );
  if (!containsKeyword) {
    res.send("Sorry, I can only answer questions about pets and animals.");
    return;
  }
  console.log(prompt);
  const completion = await openai.createCompletion({
    model: "text-davinci-003",
    max_tokens: 512,
    temperature: 0,
    prompt: prompt,
  });
  res.send(completion.data.choices[0].text);
});


app.post("/chatDM", async (req, res) => {
  const { username, secret } = req.body;

  // Fetch this user from Chat Engine in this project!
  // Docs at rest.chatengine.io
  try {
    console.log(username+secret+"dddddddddddddd")
    const r = await axios.get("https://api.chatengine.io/users/me/", {
      headers: {
        
        "Project-ID": CHAT_ENGINE_PROJECT_ID,
        "User-Name": username,
        "User-Secret": secret,
      },
    });
    return res.status(r.status).json(r.data);
  } catch (e) {
    return res.status(e.response.status).json(e.response.data);
  }
});
// app.post("/chatDM", async (req, res) => {
//   const { username, secret } = req.body;

//   try {
//     const r = await axios.get("https://api.chatengine.io/users/me/", {
//       headers: {
//         "Project-ID": CHAT_ENGINE_PROJECT_ID,
//         "User-Name": username,
//         "User-Secret": secret,
//       },
//     });
//     return res.status(r.status).json(r.data);
//   } catch (e) {
//     if (e.response) {
//       return res.status(e.response.status).json(e.response.data);
//     } else {
//       // Handle other errors
//       console.log(e);
//       return res.status(500).json({ error: "Internal Server Error" });
//     }
//   }
// });

app.use('/pet', petRouter); 

