const express = require('express');
const multer = require('multer');
const fs = require('fs');
const router = express.Router();
const podcastController = require('../../controller/Podcast');

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/audio');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage });
// Create a new podcast
router.post('/addpodcast', upload.single('audio'), podcastController.createPodcast, (req, res) => {
  console.log(req.file);
  res.send('File uploaded successfully');
}
  );
// Get all podcasts
router.get('/podcast', podcastController.getAllPodcasts);



// Get a single podcast by ID
router.get('/podcast/:id', podcastController.getPodcastById);

// Update a podcast by ID
router.patch('/updatepodcast/:id', podcastController.updatePodcastById);

// Delete a podcast by ID
router.delete('/deletepodcast/:id', podcastController.deletePodcastById);

module.exports = router;
