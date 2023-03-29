const mongo = require("mongoose");
const schema = mongo.Schema; 
const User = require('../models/user');


var Upgrade = new schema({
  name: {
    type: String,
  },
  user: {
    type: schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  bio: {
    type: String,
  },
  file: {
    type: String,
    required: true,
  },
  logo: {
    type: String, 
  },
  type: {
    type: String,
    required: true,
  },
  latitude: {
    type: Number,
  },
  longitude: {
    type: Number,
  },
});
 
 

module.exports = mongo.model("Upgrade", Upgrade);
