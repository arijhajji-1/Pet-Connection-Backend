const mongo = require("mongoose");
const schema = mongo.Schema;
const Funding = require("../models/funding");
const User = require("../models/user");

var Donation = new schema({
  user: {
    type: schema.Types.Mixed,
  },
  funding: {
    type: schema.Types.ObjectId,
    ref: "Funding",
    required: true,
  },
  total: {
    type: Number,
  },
  createdAt: {
    type: Date,
  },
});

module.exports = mongo.model("Donation", Donation);
