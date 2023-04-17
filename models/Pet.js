const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({
  name: {
    type: String,
   // required: true
  },
  color: {
    type: String,
 
    //required: true
  },
  breed: {
    type: String,
    //required: true
  },
 
  categoryPet: {
    type: String,
   
   // required: true
  },
// relation user pet 
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
 
 //upload list of images 
 images: [{
  type: String,
 
}],
});

const Pet = mongoose.model('Pet', petSchema);

module.exports = Pet;
