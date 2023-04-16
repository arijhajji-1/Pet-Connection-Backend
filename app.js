const express = require('express');
const http = require('http')
const mongo = require('mongoose'); 
const mongoconnection = require('./config/mongoconnection.json'); 
const bodyParser = require("body-parser");
const cors = require('cors');
const session = require('express-session')
const path = require("path");
const paymentRoutes=require("./routes/Marketplace/payment");

// =========== Database Connection ==============
mongo.connect("mongodb+srv://yosramekaoui:yosra@cluster0.aalwf4q.mongodb.net/ace?retryWrites=true&w=majority"
).then(()=>console.log("Db Connect")).catch((err)=>{
    console.log(err);
});



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


// ============ routes =================
var useRouter = require('./routes/User/user'); 
app.use('/user', useRouter); 


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





 

// ========= server creation =============
const server = http.createServer(app); 
server.listen(3000, () => console.log('server'))

  
//================//
