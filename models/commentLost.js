const mongoose = require('mongoose');

const commentLostSchema = new mongoose.Schema({
  //   user: {
  //       type: mongoose.Schema.Types.ObjectId,
  //       ref: 'User'
  //     },
  // content: {
  //   type: String,
  //   required: true
  // },
  // date: {
  //   type: Date,
  //   default: Date.now
  // },
  // lost: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'lost'
  // },
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
