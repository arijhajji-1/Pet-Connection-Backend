const mongo = require('mongoose');
const schema = mongo.Schema; 

var Product = new schema({
    name: {type: String,required: true,unique: true},
    desc: {type: String, required: true },
    img: {type: String, required: true },
    categories: {type: Array },
    price: {type: Number, required: true },
    
}); 
module.exports = mongo.model("product", Product)