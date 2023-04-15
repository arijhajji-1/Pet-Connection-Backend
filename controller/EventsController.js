const Event = require('../models/Events');
const { sign, verify } = require('jsonwebtoken')

const fs = require('fs');
const User = require('../models/user');
const mongoose = require('mongoose');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
})

const upload = multer({ storage: storage })

// GET all events
const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET a single event by ID
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getConnectedUserId = (req) => {
  return req.query.userId || req.params.userId;
};



const createEvent = async (req, res) => {
  let { title, description, date, location, image, organizer, organizerPic } = req.body;

  try {
    const existingEvent = await Event.findOne({ title, date });

    if (existingEvent) {
      return res.status(400).json({ message: "An event with the same title and date already exists" });
    }

    const newEvent = new Event({
      title,
      description,
      date,
      location,
      image,
      organizer,
      attendees: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      attendeesCount: 0,
      organizerPic
    });

    if (req.file) {
      const filename = `${Date.now()}-${req.file.originalname}`;
      const filepath = `uploads/${filename}`;
      fs.renameSync(req.file.path, filepath);
      newEvent.image = filename;
    }

    if (req.file && req.file.fieldname === 'organizerPic') {
      const organizerPicFilename = `${Date.now()}-${req.file.originalname}`;
      const organizerPicFilepath = `uploads/${organizerPicFilename}`;
      fs.renameSync(req.file.path, organizerPicFilepath);
      newEvent.organizerPic = organizerPicFilename;
    }

    await newEvent.save();
    res.json(newEvent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};






// UPDATE an existing event by ID
const updateEventById = async (req, res) => {
  const { title, description, date, location, image, organizer, organizerPic } = req.body;


  try {
    let event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    if (event.organizer !== organizer) { // check if the current user is the organizer of the event
      return res.status(403).json({ message: 'You are not authorized to update this event' });
    }

    if (req.file && req.file.size > 0) { // check if the file exists and is not empty
      const filename = `${Date.now()}-${req.file.originalname}`;
      const filepath = `uploads/${filename}`;
      fs.renameSync(req.file.path, filepath);
      event.image = filename;
      event.organizerPic = filename
    }

    event.title = title;
    event.description = description;
    event.date = date;
    event.location = location;
    event.updatedAt = new Date();
    await event.save();
    res.json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


// DELETE an existing event by ID

const deleteEventById = async (req, res) => {
  const connectedUserId = req.body.connectedUserId;
  console.log(connectedUserId); // Add this line to check the request body


  try {
    let event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    if (event.organizer !== connectedUserId) { // check if the current user is the organizer of the event
      return res.status(403).json({ message: 'You are not authorized to delete this event' });
    }
    await event.remove();
    res.json({ message: 'Event deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ADD a user as an attendee to an event by ID

const addAttendeeById = async (req, res) => {
  const connectedUserId = req.body.userId;
  console.log(connectedUserId, "joined");
  try {
    let event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.attendees.includes(connectedUserId)) { // check if the current user is already an attendee
      return res.status(400).json({ message: 'You have already joined this event' });
    }
    event.attendees.push(connectedUserId); // add the user to the attendees array
    event.attendeesCount++; // increment the attendeeCount attribute
    await event.save();
    res.json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


// REMOVE a user as an attendee from an event by ID
const removeAttendeeById = async (req, res) => {
  const connectedUserId = req.body.connectedUserId;
  console.log(req.body); // Add this line to check the request body

  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    if (!Array.isArray(event.attendees) || event.attendees.length === 0) {
      return res.status(400).json({ message: 'No attendees found for this event' });
    }
    console.log('Event attendees:', event.attendees);
    console.log('Connected user ID:', connectedUserId);
    if (!event.attendees.includes(connectedUserId)) { // check if the current user is not an attendee
      return res.status(400).json({ message: 'You have not joined this event' });
    }
    const attendees = event.attendees.filter((attendeeId) => attendeeId.toString() !== connectedUserId);
    event.attendees = attendees;
    event.updatedAt = new Date();
    event.attendeesCount--; // decrement the attendeeCount attribute

    await event.save();
    res.json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
const LikeEvent = async (req, res) => {
  const { eventId } = req.params;
  const { userId } = req.body;

  try {
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if the user has already liked the event
    if (!event.Like.includes(userId)) {
      event.Like.push(userId);
      event.NumberLikes++; 

      await event.save();
      res.status(200).json({ event: { Like: event.Like } });
    } else {
      return res.status(400).json({ message: 'You have already liked this event' });
    }


  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating event likes' });
  }
};



const dislikeEvent = async (req, res) => {
  const { eventId } = req.params;
  const { userId } = req.body;

  try {
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if the user has already disliked the event
    if (event.Like.includes(userId)) {
      event.Like = event.Like.filter((likeUserId) => likeUserId.toString() !== userId);
      event.NumberLikes--; // decrement the attendeeCount attribute

      await event.save();
      res.status(200).json({ event: { Like: event.Like } });
    } else {
      return res.status(400).json({ message: 'You have not liked this event yet' });
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating event likes' });
  }
};











module.exports = { getAllEvents, getEventById, createEvent, updateEventById, deleteEventById, upload, addAttendeeById, removeAttendeeById, LikeEvent, dislikeEvent };