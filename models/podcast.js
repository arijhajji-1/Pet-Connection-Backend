const mongoose = require('mongoose');

const podcastSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  audio: {
    type: String,
    required: true,
  },
  transcription: {
    type: String,
    default: '',
  },
  username: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  playlist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Playlist',
    default: null,
  },
});

module.exports = mongoose.model('podcasts', podcastSchema);
