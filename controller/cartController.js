const express=require('express');
const Cart = require("../models/Cart")
const User = require('../models/user');
const jwt = require('jsonwebtoken');


const { sign, verify } = require('jsonwebtoken')

exports.addCart = async (req,res) => {
    const newCart = new Cart(req.body);
    try{
        const savedCart = await newCart.save();
        res.status(200).json(savedCart);
    
    }catch (err){
        res.status(500).json(err);
    }
}
exports.updateCart = async (req,res) => {
    try{
        const updatedCart = await Cart.findByIdAndUpdate(req.params.id,
            {$set: req.body,
             },
             {new: true}
             );
             res.status(200).json(updatedCart);
    }catch (err){
        res.status(500).json(err)
    }
}
exports.deleteCart = async (req, res) => {
    try {
      await Cart.findByIdAndDelete(req.params.id);
      res.status(200).json("Product Deleted")
    } catch (error) {
        res.status(500).json(err);
    }
  }

  exports.getAll = async (req, res) => {
    try{
        const carts = await Cart.find()
        res.status(200).json(carts)
    }catch(err){
        res.status(500).json(err)
    }

  }

  //Get User Carts
  
  exports.getCartById = async (req, res) => {
    try {
      const cart = await Cart.findOne({ userId: req.params.userId });
      res.status(200).json(cart);
    } catch (error) {
        res.status(500).json(err);
    }
  }

 