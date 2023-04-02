const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Association = require("../models/association");
const user = require("../models/user");

const app = express();
const upload = multer({ dest: "public/associations/" });

const addAssociation = async (req, res) => {
  var u = await user.findById(req.body.user);
  u.role = "Association";
  u.save(); 

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
     
      
       
     const { name, user, type, latitude, longitude, bio, date,action } = req.body;
     Association.create({
       name: name,
       user: user,
       image: `${req.body.user}${file.filename}`,
       latitude: latitude,
       longitude: longitude,
       bio: bio,
       date: date,
       action : action
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


const deleteAssociation = async (req, res) => {
    try {
        // connectedUserId = getConnectedUserId(req); 
        // Connected = await User.findById(connectedUserId);
        await Association.findByIdAndRemove(req.params.id);
        res.send("Association deleted!");

    } catch (err) {
        res.send(err)
    }
}


const getOneAssociation = async (req, res) => {
  try {
    await Association.findById(req.params.id).then((result) => {
      res.send(result);
    });
  } catch (err) {
    res.send(err);
  }
};


const getAssociationByUser = async (req, res) => {
  try {
    await Association.findOne({ user : req.params.id }).then((result) => {
      res.send(result);
    });
  } catch (err) {
    res.send(err);
  }
};



const editAssociation = async (req, res) => { 
  var image = "";
  const file = req.file;
    if (file) {
    
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
      })
      
      image = `${req.body.user}${file.filename}`;
      
  }

  const { name, latitude, longitude, bio, date, action } = req.body;
  if (image == "") {
    await Association.findOneAndUpdate(
      { _id: req.params.id },
      {
        name: name,
        action: action, 
        bio: bio,
        latitude: latitude,
        longitude: longitude,
      }
    ).then((result) => {
      res.send("association edited");
    });
  } else {
    await Association.findOneAndUpdate(
      { _id: req.params.id },
      {
        name: name,
        action: action, 
        bio: bio,
        latitude: latitude,
        longitude: longitude,
        image: `${req.body.user}${file.filename}`,
      }
    ).then((result) => {
      res.send("association edited with image");
    });
  }
    // const association = {
    //   name = name,
    //   action = action, 
    //   date = date,
    //   bio = bio ,
    //   latitude = latitude, 
    //   longitude = longitude,
    // }
    // association.name = name; 
    // association.action = action; 
    // association.date = date; 
    // association.bio = bio; 
    // association.latitude = latitude; 
    // association.longitude = longitude; 
    // association.save(); 
  
    //res.send(association);  
  
};


const upgradeToAssociation = async (req, res) => {
  var u = await user.findById(req.body.user);
  u.role = "Association";
  u.save();
 

    const { name, user, latitude, longitude, bio, date, action , file} =
      req.body;
    Association.create({
      name: name,
      user: user,
      image: file ,
      latitude: latitude,
      longitude: longitude,
      bio: bio,
      date: new Date(),
      action: action,
    }).then((association) => {
      res.send(association);
    });
   
};


module.exports = {
  addAssociation,
  getAllAssociations,
  deleteAssociation,
  getOneAssociation,
  getAssociationByUser,
  editAssociation,
  upgradeToAssociation
}; 