const express = require('express');
const lost = require("../models/lost")
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');

//add lost or found pet 
async function addlostwithUser(req, res) {


  // Create a new pet document and add it to the user's pets array
  const user = JSON.parse(req.body.user);
   
   const user1 = await User.findById(user._id);

  // Make a request to the prediction API using the first image in the array
  const form = new FormData();
  const firstImage = req.files[0];
  form.append('image', fs.createReadStream(firstImage.path), firstImage.filename);
  const response = await axios.post('http://localhost:8000/pet/predict/', form, {
    headers: {
      ...form.getHeaders(),
    },   

  });
  const predictedBreed = response.data;
  console.log("breed=" + predictedBreed)
  const Pet = new lost({
    color: req.body.color,
    breed: predictedBreed,
    location:req.body.location,
    type: req.body.type,
    user: user1._id, 
    description:req.body.description,
     image: req.files.map((file) => file.filename),
  }); 
  
  await Pet.save();
   user1.losts.push(Pet._id);
   await user1.save();

  res.status(201).json({ message: 'Pet added successfully' });

}

// GET all pets for the authenticated user
async function getAllLostsuser(req, res) {
  try { 
  
    console.log(req.body.user);
    
    if (!req.body.user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const pets = await lost.find({ user: req.body.user._id });
    return res.json(pets);
  } catch (err) {
    console.error(`Error: ${err}`);
    return res.status(500).json({ error: 'Server error' });
  }
}

// get all lost and found pets 
async function getAllLost(req, res) {
  try {
    const lostList = await lost.find();
    res.status(200).json(lostList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
module.exports={
  addlostwithUser,getAllLost,getAllLostsuser
}