const express = require('express');
const pet = require("../models/Pet")
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const { LocalStorage } = require('node-localstorage');
const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');
// Create a new LocalStorage instance with a specified storage path
const localStorage = new LocalStorage('./localstorage');

const { sign, verify } = require('jsonwebtoken')

//add pet without login 
async function addPet(req, res, next) {

  try {
    const Pet = new pet(req.body);
    Pet.save((err, data) => {
      if (err) {
        console.log(err.stack);

      }
      // console.log(data);
      return res.json(data);
    });
  } catch (err) {
    console.log(err);
  }
}
// GET all pets for the authenticated user
async function getAllpets(req, res) {
  try {
    const userId = req.body.user1._id; // Get the user ID from the request body
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const pets = await pet.find({ user: user._id }); // Find pets with matching user ID

    return res.json(pets);
  } catch (err) {
    console.error(`Error: ${err}`);
    return res.status(500).json({ error: 'Server error' });
  }
}

// POST a new pet for a user



//=================================================================================================================================test
async function addPetwithUser(req, res) {
  // Create a new pet document and add it to the   user's pets array
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
  const Pet = new pet({
    name: req.body.name,
    color: req.body.color,
    breed: predictedBreed,
    age: req.body.age,
    categoryPet: req.body.categoryPet,
    user: user1._id,
    images: req.files.map((file) => file.filename),
  });
  await Pet.save();
  user1.pets.push(Pet._id);
  await user1.save();

  res.status(201).json({ message: 'Pet added successfully' });

}






//delete pet from user

async function deletepet(req, res) {
  try {
    //get user 
    const user = JSON.parse(req.body.user);
    const user1 = await User.findById(user._id);

    // Find the pet to be removed
    const Pet = await pet.findById(req.params.petId);
    if (!Pet) {
      return res.status(404).json({ error: 'Pet not found' });
    }
    // Remove the pet from the database
    if (user1.pets.pop()) {
      await Pet.remove();
    }

    // Save the user to update the pets array
    await user.save();
    res.json({ message: 'Pet deleted successfully' });

  }
  catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
}
// update pet from user 
async function updatePetwithUser(req, res) {

  try {
    console.log(req.params.id)
    const updatedPet = await pet.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedPet);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
}
// adminnnnnnnnnnnnnnnnnnnnnnn=============================
// GET all pets
async function getAllPetsAdmin(req, res) {
  try {
    const pets = await pet.find(); // Find all pets in the Pet model

    return res.json(pets);
  } catch (err) {
    console.error(`Error: ${err}`);
    return res.status(500).json({ error: 'Server error' });
  }
}
 
const Joi = require('joi'); // Import the Joi validation library

// Update pet
 
async function updatePetAdmin(req, res) {
  try {
    // Validate input data (example using a basic check for required fields)
    const { name, color, breed, type } = req.body;
    if (!name || !color || !breed || !type) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Update pet document
    const updatedPet = await pet.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedPet) {
      return res.status(404).json({ message: 'Pet not found' });
    }

    res.status(200).json({ message: 'Pet updated successfully', pet: updatedPet });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}
//delete pet from user

async function deletepetAdmin(req, res) {
  try {
    

    // Find the pet to be removed
    const Pet = await pet.findById(req.params.id);
    Pet.remove();
    if (!Pet) {
      return res.status(404).json({ error: 'Pet not found' });
    }
    
    res.json({ message: 'Pet deleted successfully' });

  }
  catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
}
//delete pet from user
async function deletepetimgae(req, res) {
  try {
    //get user 
    console.log(req.body.user1)

    // // Find the pet to be removed
    const petId = req.params.petId;
    const pett = await pet.findById(petId);
    console.log(pett)
    if (!pett) {
      return res.status(404).json({ error: 'Pet not found' });
    }

      pett.images.shift();
      await pett.save();
    

    res.json({ message: 'Image deleted successfully' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
}



module.exports = {
  addPet, getAllpets, addPetwithUser, deletepet, updatePetwithUser, getAllPetsAdmin, updatePetAdmin,deletepetAdmin,deletepetimgae
}