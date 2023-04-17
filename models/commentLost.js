const mongoose = require('mongoose');

const commentLostSchema = new mongoose.Schema({
   
  id:{
    type:String
  },
  body:{
    type:String
  },
  id:{
    type:String
  }
  ,
  username:{
    type:String
  },
  userId:{
    type:String
  },
  parentId:{
    type:String
  },
  createdAt:{
    type:String
  },
   
});

const commentLost = mongoose.model('commentLost', commentLostSchema);

module.exports = commentLost;
