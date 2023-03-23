const express=require('express');
const lost=require("../models/lost")
const User = require('../models/user');
const jwt = require('jsonwebtoken');
async function addLost(req, res, next) {
  
    try {
      const Lost = new lost(req.body);
      Lost.save((err, data) => {
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
 async function getAllLosts(req, res)  {
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