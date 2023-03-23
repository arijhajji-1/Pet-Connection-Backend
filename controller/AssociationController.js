const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Association = require("../models/association");
const user = require("../models/user");

const app = express();
const upload = multer({ dest: "public/associations/" });

const addAssociation = (req, res) => {
   const file = req.file;
   if (!file) {
     return res.status(400).json({ error: "Please select a file" });
   }
   const oldPath = path.join(__dirname, "..", file.path);
   const extension = path.extname(file.originalname);
   const newPath = path.join(
     __dirname,
     "..",
     "public",
     "associations",
     `${req.body.user}${file.filename}`
   );

   // Rename the file to its original name with extension
   fs.rename(oldPath, newPath, (err) => {
     if (err) {
       console.error(err);
       return res.status(500).json({ error: "Failed to upload the file" });
     }
     
       
       
       
     const { name, user, type, latitude, longitude, bio } = req.body;
     Association.create({
       name: name,
       user: user,
       image: `${req.body.user}${file.filename}`,
       latitude: latitude,
       longitude: longitude,
       bio: bio,
     }).then((association) => {
       res.send(association);
     });
   });
};


const getAllAssociations = (req, res) => {
  try {
    Association.find({}).then((result) => {
      res.send(result);
    });
  } catch (err) {
    console.log(err);
  }
};



module.exports = {
    addAssociation,
    getAllAssociations
}; 