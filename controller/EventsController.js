const Event = require('../models/Events');
const { sign, verify } = require('jsonwebtoken')
const multer = require('multer');
const fs = require('fs');
const User = require('../models/user');
const { updateuseradmin } = require('./UserController');

const upload = multer({ dest: 'uploads/' });
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
    // get User
    const accessToken = req.cookies["access-token"];
    if (!accessToken) {
        return res.status(401).json({ message: "Access token not found" });
    }
    const decodedToken = verify(accessToken, "azjdn1dkd3ad");
    UserId= decodedToken.id;
    console.log(decodedToken.id); // Add this line to check the value of decodedToken.id

    
    return UserId; 
    //const user = await User.findById(req.userId);
    //res.send(user)
}
// CREATE a new event
const createEvent = async (req, res) => {
  let { title, description, date, location, image } = req.body;

  const userId= getConnectedUserId(req);

  

  // check if the event already exists
  const existingEvent = await Event.findOne({ title, date });
  if (existingEvent) {
    return res
      .status(400)
      .json({ message: "An event with the same title and date already exists" });
  }

  const user = await User.findById(userId);
  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  try {
    const newEvent = new Event({
      title,
      description,
      date,
      location,
      image,
      organizer: user.username, // set the organizer field to the user's id
      attendees: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    if (req.file) {
      // Rename the file to a unique name to prevent overwriting
      const filename = `${Date.now()}-${req.file.originalname}`;
      const filepath = `uploads/${filename}`;
      // Move the file to the uploads directory
      fs.renameSync(req.file.path, filepath);
      newEvent.image = filename;
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
    const connectedUserId = getConnectedUserId(req); 

  const { title, description, date, location,image } = req.body;
  try {
    let event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    if (event.organizer.toString() !== connectedUserId.toString()) { // check if the current user is the organizer of the event
      return res.status(403).json({ message: 'You are not authorized to update this event' });
    }
    if (req.file) {
      // Remove the old image file
      if (event.image) {
        const filepath = `uploads/${event.image}`;
        fs.unlinkSync(filepath);
      }
      // Rename the new file to a unique name to prevent overwriting
      const filename = `${Date.now()}-${req.file.originalname}`;
      const filepath = `uploads/${filename}`;
      // Move the file to the uploads directory
      fs.renameSync(req.file.path, filepath);
      event.image = filename;
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
    const connectedUserId = getConnectedUserId(req); 

  try {
    let event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    if (event.organizer.toString() !== connectedUserId.toString()) { // check if the current user is the organizer of the event
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
    connectedUserId = getConnectedUserId(req); 

    try {
    let event = await Event.findById(req.params.id);
    if (!event) {
    return res.status(404).json({ message: 'Event not found' });
    }
    if (event.attendees.includes(connectedUserId )) { // check if the current user is already an attendee
    return res.status(400).json({ message: 'You have already joined this event' });
    }
    event.attendees.push(connectedUserId );
    event.updatedAt = new Date();
    await event.save();
    res.json(event);
    } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
    }
    };
    
    // REMOVE a user as an attendee from an event by ID
    const removeAttendeeById = async (req, res) => {
        connectedUserId = getConnectedUserId(req); 

    try {
    let event = await Event.findById(req.params.id);
    if (!event) {
    return res.status(404).json({ message: 'Event not found' });
    }
    if (!event.attendees.includes(connectedUserId )) { // check if the current user is not an attendee
    return res.status(400).json({ message: 'You have not joined this event' });
    }
    event.attendees = event.attendees.filter((attendee) => attendee.toString() !== connectedUserId .toString());
    event.updatedAt = new Date();
    await event.save();
    res.json(event);
    } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
    }
    };
module.exports = { getAllEvents, getEventById, createEvent, updateEventById, deleteEventById ,upload,  addAttendeeById, removeAttendeeById };