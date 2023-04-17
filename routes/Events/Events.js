const express = require('express');
const router = express.Router();
const { createToken, validateToken } = require('../../midill/JWT/JWT'); 
const cookieParser = require("cookie-parser")
const bodyparser = require("body-parser")  
router.use(express.json())
router.use(cookieParser())
const {getAllEvents, getEventById, createEvent, updateEventById, upload,deleteEventById ,  addAttendeeById, removeAttendeeById, LikeEvent, dislikeEvent }= require("../../controller/EventsController")
const { addCommentById, addReplyToCommentById,getCommentsByEventId, deleteCommentById, updateCommentById, reportCommentById,handleDeleteReply,handleEditReply, getReportedComments, deleteComment}= require("../../controller/CommentEventController")

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

// ADD a comment to an event by ID
router.post('/addComment', addCommentById);

// ADD a reply to a comment by ID
router.post('/addReply/:commentId', addReplyToCommentById);

// GET all comments and replies associated with an event by ID
router.get('/getCommentsEvent/:eventId', getCommentsByEventId);
router.delete ('/deleteComment/:commentId',deleteCommentById);
router.put('/updateComment/:commentId',updateCommentById);
router.post ('/reportComment/:commentId',reportCommentById);
router.delete ('/deleteReply/:commentId/:replyId',handleDeleteReply);
router.put('/editReply/:commentId/:replyId',handleEditReply);
router.post ('/likeEvent/:eventId',LikeEvent);
router.delete('/dislikeEvent/:eventId',dislikeEvent);
router.get('/reportedComment',getReportedComments);
router.delete ('/deleteComments/:commentId',deleteComment);

module.exports = router;
