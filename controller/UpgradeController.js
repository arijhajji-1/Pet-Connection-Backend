const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Upgrade = require("../models/upgrade");
const user = require("../models/user");

const app = express();
const upload = multer({ dest: "public/upgrades/" });

 

const upgradeUser = (req, res) => {
 
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
    "upgrades",
    `${req.body.user}${file.filename}`
    );

    // Rename the file to its original name with extension
    fs.rename(oldPath, newPath, (err) => {
    if (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to upload the file" });
    }
    // res.json({ message: "File uploaded successfully" });
        
        const { name, user, type } = req.body;
        Upgrade.create({
          name: name,
          user: user,
          file: `${req.body.user}${file.filename}`,
          type: type,
        }).then((upgrade) => {
          res.send(upgrade);
        });
    
    });
};


const getAllUpgrades = (req, res) => {
    try {
      Upgrade.find({}).then((result) => {
        res.send(result);
      });
    } catch (err) {
      console.log(err);
    } 
}



const deleteUpgrade = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user exists
    const upgrade = await Upgrade.findById(id);
    if (!upgrade) {
      return res.status(404).json({ message: "Upgrade not found." });
    }

    // Delete user
    await Upgrade.findByIdAndRemove(id);

    res.json({ message: "Upgrade deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};



const changeType = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user exists
    const us = await user.findById(id);
    if (!us) {
      return res.status(404).json({ message: "User not found." });
    }

    // Delete user
    await us.update({ role : req.body.type });

    res.json({ message: "User upgraded to " + req.body.type });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};


module.exports = {
  upgradeUser,
  getAllUpgrades,
  deleteUpgrade,
  changeType,
}; 