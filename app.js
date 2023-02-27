const express = require('express');
const http = require('http')
const mongo = require('mongoose'); 
const mongoconnection = require('./config/mongoconnection.json'); 
const bodyParser = require("body-parser")


// =========== Database Connection ==============
/*mongo.connect(mongoconnection.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("DataBase Connected");
}).catch((err) => {
    console.log(err);
});*/
mongo.connect("mongodb+srv://yosramekaoui:yosra@cluster0.aalwf4q.mongodb.net/ace?retryWrites=true&w=majority"
).then(()=>console.log("Db Connect")).catch((err)=>{
    console.log(err);
});


// ============= configuration express ================
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());



// ============ routes =================
var useRouter = require('./routes/User/user'); 
app.use('/user', useRouter); 


var productRouter = require('./routes/Marketplace/product'); 
const { default: mongoose } = require('mongoose');
app.use('/', productRouter); 
var cartRouter = require('./routes/Marketplace/cart'); 
app.use('/', cartRouter);
var orderRouter = require('./routes/Marketplace/order'); 
app.use('/', orderRouter);



 




// ========= server creation =============
const server = http.createServer(app); 
server.listen(3000, () => console.log('server'))
