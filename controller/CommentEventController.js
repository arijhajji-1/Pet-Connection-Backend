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

const addReplyToCommentById = async (req, res) => {
  const {  text, image, username } = req.body;
  const commentId = req.params.commentId;

  console.log('commentId:', commentId);
  console.log('text:', text);
  console.log('image:', image);
  console.log('username:', username);

  try {
    let comment = await Comment.findById(commentId);

    console.log('comment:', comment);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    const newReply = {
      text,
      image,
      username
    };

    console.log('newReply:', newReply);

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
// DELETE a comment by ID
const deleteCommentById = async (req, res) => {
  const commentId = req.params.commentId;
  const { username } = req.body; // <-- Get username from req.body
  try {
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.username !== username.toString()) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    console.log(username)

    await Comment.findByIdAndDelete(commentId);
    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


// UPDATE a comment by ID
const updateCommentById = async (req, res) => {
  const commentId = req.params.commentId;
  const { text, username } = req.body;

  if (!text) {
    return res.status(400).json({ message: 'Text is required' });
  }

  if (!username) {
    return res.status(400).json({ message: 'Username is required' });
  }

  try {
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.username !== username.toString()) {
      return res.status(401).json({ message: 'You are not authorized to update this comment' });
    }

    comment.text = text;

    await comment.save();
    res.json(comment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


// REPORT a comment by ID
const reportCommentById = async (req, res) => {
  const commentId = req.params.commentId;

  try {
    let comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    comment.reported = true;

    await comment.save();
    res.json(comment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
module.exports = { addCommentById, addReplyToCommentById, getCommentsByEventId,reportCommentById,updateCommentById,deleteCommentById };
