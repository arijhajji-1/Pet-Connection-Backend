const express=require('express');
const pet=require("../models/Pet")
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const { LocalStorage } = require('node-localstorage');

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
 async function getAllpets(req, res)  {
    try {
      
        const accessToken = req.cookies["access-token"];

        if (!accessToken) {
          return res.status(401).json({ message: "Access token not found" });
        }
       
          const decodedToken = verify(accessToken, "azjdn1dkd3ad");
           
          req.userId = decodedToken.id;
    
          const user = await User.findById(req.userId );
     
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      const pets = await pet.find({ user: req.userId  });
       
      return res.json(pets);
    } catch (err) {
      console.error(`Error: ${err}`);
      return res.status(500).json({ error: 'Server error' });
    }
  }
// POST a new pet for a user
/*
 async function addPetwithUser (req, res)  {
    
        const accessToken = req.cookies["access-token"];

        if (!accessToken) {
          return res.status(401).json({ message: "Access token not found" });
        }
       
          const decodedToken = verify(accessToken, "azjdn1dkd3ad");
           
          req.userId = decodedToken.id;
    const user = await User.findById(req.userId );
 

        // Create a new pet document and add it to the user's pets array
        const Pet = new pet({
          name: req.body.name,
          color: req.body.color,
          breed: req.body.breed,
          age: req.body.age,
          categoryPet: req.body.categoryPet,
          user: user,
        });
        await Pet.save();
        user.pets.push(Pet._id);
        await user.save();
    
        res.status(201).json({ message: 'Pet added successfully' });
      
    }*/
    //=================================================================================================================================test
    async function addPetwithUser (req, res)  {
  
        // Create a new pet document and add it to the user's pets array
       const user = JSON.parse(req.body.user);
      console.log(req.body.images)
         
       const user1 = await User.findById(user._id);
        const Pet = new pet({
          name: req.body.name, 
          color: req.body.color, 
          breed: req.body.breed,      
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
  try{
  //get user 
  const accessToken = req.cookies["access-token"];

  if (!accessToken) {
    return res.status(401).json({ message: "Access token not found" });
  }
 
    const decodedToken = verify(accessToken, "azjdn1dkd3ad");
     
    req.userId = decodedToken.id;

    const user = await User.findById(req.userId );
  // Find the pet to be removed
  const Pet = await pet.findById(req.params.petId);
  if (!Pet) {
      return res.status(404).json({ error: 'Pet not found' });
    }
  // Remove the pet from the database
  if(user.pets.pop()){
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
async function updatePetwithUser (req, res)  {
    
  const accessToken = req.cookies["access-token"];

  if (!accessToken) {
    return res.status(401).json({ message: "Access token not found" });
  }
 
    const decodedToken = verify(accessToken, "azjdn1dkd3ad");
     
    req.userId = decodedToken.id;
const user = await User.findById(req.userId );


  // Create a new pet document and add it to the user's pets array
  const Pet = new pet({
    name: req.body.name,
    color: req.body.color,
    breed: req.body.breed,
    age: req.body.age,
    categoryPet: req.body.categoryPet,
    user: user,
    images: req.files.map((file) => file.filename),
  });
  await Pet.findByIdAndupdate(req.params.id,req.body,{new:true});
  user.pets.push(Pet._id);
  await user.save();

  res.status(201).json({ message: 'Pet updated  successfully' });

}

  module.exports={
    addPet,getAllpets,addPetwithUser,deletepet,updatePetwithUser
  }