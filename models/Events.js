const mongo = require('mongoose');
const schema = mongo.Schema; 

var Events = new schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true 
    },
    dateFin: {
        type: Date,
        required: true
    },
    dateDebut: {
        type: Date,
        required: true
    },
    lieu: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
   User:
    {
        type: mongo.Schema.Types.ObjectId,
        ref: 'user'
    }




}); 
module.exports = mongo.model("Events", Events)