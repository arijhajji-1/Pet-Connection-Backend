const express = require('express');
const lost = require("../models/lost");
const comment = require("../models/commentLost");
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');
const user = require('../models/user');
 



// add comment to Lost posts user
async function addcomment(req, res, next){
    try {
         
         const Comment= new comment({
            id:req.body.id,
            body:req.body.body,
            username:req.body.username,
            userId:req.body.userId,
            parentId:req.body.parentId,
            createdAt:req.body.createdAt
         });
         Comment.save((err, data) => {
            if (err) {  
              console.log(err.stack);
              //  const userr=user.findById(req.body.userId);
              //  userr.notification.push("you have a new comment on post ");
              
              }
           
            return res.json(data);
        });
      } catch (err) {
        console.log(err);
      }
}
//get all comment
async function getAllComments(req, res, next){
    try {
        const comments = await comment.find({});
        return res.json(comments);
    } catch (err) {
        console.log(err);
    }
}
// delete comment 
const deletelost = async (req, res) => {
    try {
      const { id } = req.params;
  
      // Check if comment exists
      const Comment = await comment.findById(id);
      if (!Comment) {
        return res.status(404).json({ message: "Comment not found" });
      }
  
      // Delete comment 
      await comment.findOneAndDelete({ _id: id });
  
      res.json({ message: "Comment deleted" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  
module.exports={
    addcomment,getAllComments,deletelost
  }