const express=require('express');
const pet=require("../models/pet")
const User = require('../models/user');
const jwt = require('jsonwebtoken');


const { sign, verify } = require('jsonwebtoken')
  
//add pet without login 
async function addPet(req, res, next) {
  
    try {
      const Pet = new pet(req.body);
      Pet.save((err, data) => {
        if (err) {
          console.log(err);
           
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
    await Pet.remove();

    // Save the user to update the pets array
    await user.save();
    res.json({ message: 'Pet deleted successfully' });

}
catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
}
  module.exports={
    addPet,getAllpets,addPetwithUser,deletepet
  }