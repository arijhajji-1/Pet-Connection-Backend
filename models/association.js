const mongo = require("mongoose");
const schema = mongo.Schema;
const User = require("../models/user");

var Association = new schema({
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
  image: {
    type: String, 
  },
  latitude: {
    type: Number,
  },
  longitude: {
    type: Number,
  },
});

module.exports = mongo.model("Association", Association);
