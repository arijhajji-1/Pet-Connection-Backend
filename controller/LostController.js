const express = require('express');
const lost = require("../models/lost")
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');
const user = require('../models/user');

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
// get lost by id 
async function getLostById(req,res){
  try{
    
    const losts = await lost.find({ _id:req.params.id });
    res.json(losts);
  } catch (error) {
    res.status(500).json({ message: error.message });
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
//notificaion 
async function popNotification(req,req){
  if(req.body.user._id){
    user.findById(req.body.user._id,(err,user)=>{
      if(err){
        res.json(err);
      }
      else{
        let notification=user.notification;
        let blank=[];
        user.notification=blank;
        user.save();
        res.json(notification);
      }
    })

  }else{
    res.json("No user provided")
  }
}
//delete lost 
async function deleteLostById(req, res) {
  try {
    const lostId = req.params.id; // get the lost pet ID from the request parameters

    // Check if the lost pet exists
    const lostPet = await lost.findById(lostId);
    if (!lostPet) {
      return res.status(404).json({ error: 'Lost pet not found' });
    }
// Delete the lost pet
    await lost.findByIdAndDelete(lostId);
    // const userId = lostPet.user;
    // const user = await User.findById(userId);
    // if (user) {
    //   user.losts.pull(lostId);
    //   await user.save();
    // }
  
    return res.status(200).json({ message: 'Lost pet deleted successfully' });
  } catch (error) {
    console.error(`Error: ${error}`);
    return res.status(500).json({ error: 'Server error' });
  }
}

// update 
async function updatelost(req, res)  {
  try {
    const lostPet = await lost.findById(req.params.id)
    lostPet.description = req.body.description;
    lostPet.location = req.body.location;
    lostPet.color = req.body.color;
    lostPet.breed = req.body.breed;
    lostPet.type = req.body.type;
    // lostPet.image=req.files.map((file) => file.filename);
    if (req.file) {
      // Update the image property with the filename
      lostPet.image = req.file.filename;
    }
    
    // Save the updated lost pet to the database
    const updatedLostPet = await lostPet.save();

    // Send the updated lost pet as response
    res.json(updatedLostPet);
  } catch (error) {
    // Handle error and send error response
    res.status(500).json({ error: 'Failed to update lost pet' });
  }
};

module.exports={
  addlostwithUser,getAllLost,getAllLostsuser,getLostById
,deleteLostById,updatelost}