const { default: mongoose } = require('mongoose');

const Schema = mongoose.Schema;

const ReplySchema = new Schema({
  text: {
    type: String,
    required: true
  },
  
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },


  commnet: {
    type: Schema.Types.ObjectId,
    ref: 'Comment'
  },


  createdAt: {
    type: Date,
    default: Date.now
  }


});

const Reply = mongoose.model('Reply', ReplySchema);
module.exports = Reply
