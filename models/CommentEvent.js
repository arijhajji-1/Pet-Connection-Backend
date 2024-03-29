const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true
    },
    text: {
      type: String,
      required: true
    },
    image: {
      type: String
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    replies: [
      {
        username: {
          type: String,
          required: true
        },
        text: {
          type: String,
          required: true
        },
        image: {
          type: String
        },
        createdAt: {
          type: Date,
          default: Date.now
        },
        
  Like :
  {
    type: Number,
    default: 0,
  }
      }
    ],
  
  reportedBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  ],
  
  Like :
  {
    type: Number,
    default: 0,
  }
},
  { timestamps: true }
);

const Comment = mongoose.model('commentevents', commentSchema);

module.exports = Comment;
