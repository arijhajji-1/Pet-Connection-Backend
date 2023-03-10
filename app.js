const express = require('express');
const http = require('http')
const mongo = require('mongoose'); 
const mongoconnection = require('./config/mongoconnection.json'); 
const bodyParser = require("body-parser");
const cors = require('cors');
const session = require('express-session');

// =========== Database Connection ==============
<<<<<<< Updated upstream
mongo.connect(mongoconnection.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("DataBase Connected");
}).catch((err) => {
=======
mongo.connect("mongodb+srv://yosramekaoui:yosra@cluster0.aalwf4q.mongodb.net/ace?retryWrites=true&w=majority"
).then(()=>console.log("Db Connect")).catch((err)=>{
>>>>>>> Stashed changes
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


<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes



 




// ========= server creation =============
const server = http.createServer(app); 
server.listen(3000, () => console.log('server'))
