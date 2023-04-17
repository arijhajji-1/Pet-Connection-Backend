const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categoryEnum = ['Chat', 'Chien', 'Oiseaux',
  'Pet Grooming',
  'Medical Care',
  'Pet Bording',
  'Pet Daycare',
  'Pet Walking',
  'Education Pet',
];

const PublicationSchema = new Schema({
  titre: {
    type: String,
    required: true
  },

  description: {
    type: String,
    required: true
  },

  isBlocked: {
    type: Boolean,
    default: false
  },

  like: {
    type: Number,
    default: 0
  },

  dislike: {
    type: Number,
    default: 0
  },

  createdAt: {
    type: Date,
    default: Date.now
  },

  modifiedAt: {
    type: Date,
    default: Date.now
  },



  category: {
    type: String,
    enum: categoryEnum,
    required: true
  },

  // relation user pet 
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  //upload list of images 
  image: {
    type: String
  },



  // liste of comments 
  comments: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment'
  }],


  voteUp: {
    type: Number,
    default: 0
  },
  voteDown: {
    type: Number,
    default: 0
  },

  votes: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    type: {
      type: String,
      enum: ['voteUp', 'voteDown']
    }
  }]




});


const Publication = mongoose.model('Publication', PublicationSchema);

module.exports = Publication


