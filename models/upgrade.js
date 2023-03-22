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
  file: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
});
 
 

module.exports = mongo.model("Upgrade", Upgrade);
