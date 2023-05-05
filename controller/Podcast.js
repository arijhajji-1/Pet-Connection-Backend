const fs = require('fs');
const Podcast = require('../models/podcast');
const multer = require('multer');

const upload = multer({
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './public/audio');
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + '-' + file.originalname);
    },
  }),
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== 'audio/mp3' && file.mimetype !== 'audio/webm') {
      return cb(new Error('Only MP3 and WebM files are allowed'));
    }
    cb(null, true);
  },
  // Add maxFieldsSize and maxFileSize options to busboy
  limits: { fieldSize: 5 * 1024 * 1024, fileSize: 5 * 1024 * 1024 },
}).single('audio');

const createPodcast = async (req, res) => {
  try {
    // Check if the request includes a file
    if (!req.file) {
      return res.status(400).json({ message: 'File not found in request' });
    }

    const { title, description, username, transcription } = req.body;

    const podcast = new Podcast({
      title: title,
      description: description,
      audio: req.file.path,
      transcription: transcription,
      username: username,
    });

    const newPodcast = await podcast.save();
    res.status(201).json(newPodcast);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

// Get all podcasts
const getAllPodcasts = async (req, res) => {
  try {
    const podcasts = await Podcast.find();
    res.json(podcasts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// Get a single podcast by ID
const getPodcastById = async (req, res) => {
  try {
    const podcast = await Podcast.findById(req.params.id);
    if (podcast == null) {
      return res.status(404).json({ message: 'Cannot find podcast' });
    }
    res.json(podcast);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update a podcast by ID
const updatePodcastById = async (req, res) => {
  try {
    const podcast = await Podcast.findById(req.params.id);
    if (req.body.title != null) {
      podcast.title = req.body.title;
    }
    if (req.body.description != null) {
      podcast.description = req.body.description;
    }
    const updatedPodcast = await podcast.save();
    res.json(updatedPodcast);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a podcast by ID
const deletePodcastById = async (req, res) => {
  try {
    const podcast = await Podcast.findById(req.params.id);
    await podcast.remove();
    // Delete the audio file associated with the podcast
    fs.unlinkSync(podcast.audioPath);
    res.json({ message: 'Podcast deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAllPodcasts,
  createPodcast,
  getPodcastById,
  updatePodcastById,
  deletePodcastById,
};
