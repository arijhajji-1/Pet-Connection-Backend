const Comment = require('../models/commentEvent');
const Event = require('../models/Events');
const mongoose = require('mongoose');

// ADD a comment to an event by ID
const addCommentById = async (req, res) => {
  const { eventId, text, image, username } = req.body;
console.log(req.body)
  try {
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const newComment = new Comment({
      event: event._id,
      text: text,
      image: image,
      username: username,
      replies: []
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
  const { commentId, text, image, username } = req.body;

  try {
    let comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    const newReply = {
      text,
      image,
      username
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
    const comments = await Comment.find({ event: eventId }).populate('replies.username');
    res.json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { addCommentById, addReplyToCommentById, getCommentsByEventId };
