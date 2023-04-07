const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image
  : {
    type: String,
  },
  date: {
    type: Date,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  
  },
      updatedAt:{
    type: Date,
   

      },
      organizer: {
        type: String,
        required: true,
      },
      organizerPic: {
        type: String, // add a new field for the organizer's profile picture
        required: true,
      },
  attendees: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  attendeesCount: {
    type: Number,
    default: 0,
  },
 
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
