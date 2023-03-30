const Comment = require('../models/CommentEvent');
const Event = require ('../models/Events')
// ADD a comment to an event by ID
const addCommentById = async (req, res) => {
  const { text,userId } = req.body;

  try {
    let event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

console.log(req.body)
    const newComment = new Comment({
      user: userId,
      event: event._id,
      text,
    });

    await newComment.save();
    res.json(newComment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
// ADD a reply to a comment by ID
const addReplyToCommentById = async (req, res) => {
    const connectedUserId = req.body.userId;
  
    try {
      let comment = await Comment.findById(req.params.commentId);
      if (!comment) {
        return res.status(404).json({ message: 'Comment not found' });
      }
  
      const { text } = req.body;
  
      const newReply = {
        user: connectedUserId,
        text,
      };
  
      comment.replies.push(newReply);
      await comment.save();
      res.json(comment);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };
 // GET all comments and replies associated with an event by ID
 const getCommentsByEventId = async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const comments = await Comment.find({ event: eventId }).populate('user').populate('event');
    res.json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


  
  module.exports = { addCommentById, addReplyToCommentById, getCommentsByEventId };