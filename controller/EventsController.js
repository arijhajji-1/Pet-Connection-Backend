const Event = require('../models/Events');
const { sign, verify } = require('jsonwebtoken')
const user = require('../models/user');

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
    req.userId = decodedToken.id;
    
    return req.userId; 
    //const user = await User.findById(req.userId);
    //res.send(user)
}
// CREATE a new event
const createEvent = async (req, res) => {
    const connectedUserId = getConnectedUserId(req); 
  
    const {title, description, date, location } = req.body;
  
    // check if the event already exists
    const existingEvent = await Event.findOne({ title, date });
    if (existingEvent) {
      return res.status(400).json({ message: 'An event with the same title and date already exists' });
    }
  
    try {
      const newEvent = new Event({
        title,
        description,
        date,
        location,
        organizer: connectedUserId,
        attendees: [],
        createdAt: new Date(),
        updatedAt: new Date()
      });
      await newEvent.save();
      res.json(newEvent);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  

// UPDATE an existing event by ID
const updateEventById = async (req, res) => {
    const connectedUserId = getConnectedUserId(req); 

  const { title, description, date, location } = req.body;
  try {
    let event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    if (event.organizer.toString() !== connectedUserId.toString()) { // check if the current user is the organizer of the event
      return res.status(403).json({ message: 'You are not authorized to update this event' });
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
module.exports = { getAllEvents, getEventById, createEvent, updateEventById, deleteEventById ,  addAttendeeById, removeAttendeeById };