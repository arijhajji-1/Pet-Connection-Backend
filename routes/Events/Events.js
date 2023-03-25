const express = require('express');
const router = express.Router();
const { createToken, validateToken } = require('../../midill/JWT/JWT'); 
const cookieParser = require("cookie-parser")
const bodyparser = require("body-parser")  
router.use(express.json())
router.use(cookieParser())
const {getAllEvents, getEventById, createEvent, updateEventById, upload,deleteEventById ,  addAttendeeById, removeAttendeeById }= require("../../controller/EventsController")

// GET all events
router.get('/getAll', getAllEvents);

// GET a single event by ID
router.get('/get/:id', getEventById);

// CREATE a new event
router.post('/add', upload.single('image'), createEvent);

// UPDATE an existing event by ID
router.put('/update/:id',upload.single('image'), updateEventById);

// DELETE an existing event by ID
router.delete('/delete/:id', deleteEventById);
// ADD a user as an attendee to an event by ID
router.post('/addAttendees/:id',addAttendeeById);

// REMOVE a user as an attendee from an event by ID
router.delete('/deleteAttendees/:id', removeAttendeeById);


module.exports = router;
