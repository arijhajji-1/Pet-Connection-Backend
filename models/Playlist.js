const mongoose = require('mongoose');

const playlistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image:{
    type:String,
required:true
  },
  podcasts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Podcast',
  }],
});

module.exports = mongoose.model('Playlist', playlistSchema);
