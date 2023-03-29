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
app.use('/user', useRouter); 




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