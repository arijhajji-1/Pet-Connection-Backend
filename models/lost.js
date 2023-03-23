const mongoose = require('mongoose');

// Define the Lost schema
const lostSchema = new mongoose.Schema({
  name: {
    type: String,
   // required: true
  },
  description: {
    type: String,
    //required: true
  },
  image: {
    type: String,
   // required: true
  },
  location: {
    type: String,
    //required: true
  },
  color: {
    type: String,
    //required: true
  }
});

// Create the Lost model
const Lost = mongoose.model('Lost', lostSchema);

module.exports = Lost;
