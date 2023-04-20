const { default: mongoose } = require('mongoose');

const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  text: {
    type: String,
    required: true
  }, 
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },


  publication: {
    type: Schema.Types.ObjectId,
    ref: 'Publication'
  },


  replies: [{
    type: Schema.Types.ObjectId,
    ref: 'Reply'
  }], 


  createdAt: {
    type: Date,
    default: Date.now
  }


});

const Comment = mongoose.model('Comment', CommentSchema);
module.exports = Comment
