const mongo = require('mongoose');
const schema = mongo.Schema; 

var User = new schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true 
    },
    name: {
        type: String,
        required : true
    },
    email: {
        type: String,
        required: true,
        unique : true
    },
    role: {
        type: String,
        required : true
    },
    phone: {
        type: String,
        required : true
    },
    image: {
        type: String,
        required : true
    },
    location: {
        type: String,
        required : true
    }

}); 
module.exports = mongo.model("user", User)