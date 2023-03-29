const mongo = require("mongoose");
const schema = mongo.Schema;
const Association = require("../models/association");

var Funding = new schema({
  title: {
    type: String,
  },
  association: {
    type: schema.Types.ObjectId,
    ref: "Association",
    required: true,
  },
  desc: {
    type: String,
  },
  image: {
    type: String,
  }, 
  total: {
    type : Number
  },
  date: {
    type: Date
  }

});

module.exports = mongo.model("Funding", Funding);
