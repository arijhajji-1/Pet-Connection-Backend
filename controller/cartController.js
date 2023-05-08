const express=require('express');
const Cart = require("../models/Cart")
const User = require('../models/user');
const Product = require('../models/product');

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

////////////////////////////////////
exports.addProductToCart = async (req, res) => {
    try {
      const productId = req.params.id; // ID of product to add
     
     
       //const user = JSON.parse(req.body.user); // Convert string to object
       const user1 = await User.findById(req.body.user._id);
       
      
      if (!user1) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const cart = await Cart.findOne({ userId: user1._id }); // Find user's cart
      console.log(cart);
      if (!cart) {
        // If user has no cart, create one
       
        const newCart = new Cart({ userId: user1._id, products: [] });
        await newCart.save();
        user1.cart = newCart;
        console.log("cart added ")

      }
  
      // Add product to cart
      const productIndex = cart.products.findIndex(
        (product) => product.productId === productId
      );
      if (productIndex !== -1) {
        // If product is already in cart, increment quantity
        cart.products[productIndex].quantity += 1;
      } else {
        // If product is not in cart, add it
        cart.products.push({ productId: productId, quantity: 1 });
      }
  
      await cart.save(); // Save changes to cart
      await user1.save(); // Save changes to user
  
      res.status(200).json({ message: "Product added to cart" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  };
  
// list of product from user

exports.getCartProductsByUser = async (req, res) => {
  try {
    // const user1 = await User.findById(req.body.user._id);
    const cart = await Cart.findOne({ userId: req.body.user._id});
    if (!cart) {
      console.log("cart vide")
      return []; // return an empty array if no cart is found for the given user ID
    }
    const productIds = [];

    // loop over cart.products array and add unique product IDs to productIds array
    cart.products.forEach((product) => {
      if (!productIds.includes(product.productId)) {
        productIds.push(product.productId);
      }
    });
    console.log(productIds)
    const products = await Product.find({ _id: { $in: productIds } });
    
    // Create a new array of cart products that includes the quantity of each product in the cart
    const cartProducts = cart.products.map((product) => {
      const cartProduct = products.find((p) => p._id.toString() === product.productId);
      return {
        ...cartProduct.toObject(),
        quantity: product.quantity,
      };
    });
    
    res.status(200).json(cartProducts); 
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to retrieve cart products by user" }); // return a 500 status code and an error message if an error occurs
  }
};
//delete product from list 

exports.deleteProductFromCart = async (req, res) => {
  try {
    const productId = req.params.id; // ID of product to remove
    const user1 = await User.findById(req.body.user._id);

    if (!user1) {
      return res.status(404).json({ message: "User not found" });
    }

    const cart = await Cart.findOne({ userId: user1._id }); // Find user's cart
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Find product index in cart products array
    const productIndex = cart.products.findIndex(
      (product) => product.productId === productId
    );
    if (productIndex === -1) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    // Remove product from cart products array
    cart.products.splice(productIndex, 1);
    console.log(cart)
    // Save updated cart
    await cart.save();

    res.status(200).json({ message: "Product removed from cart" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to remove product from cart" });
  }
};
 // subtract 1 from product quantity
exports.subtractFromCart = async (req, res) => {
  try {
    const user1 = await User.findById(req.body.user._id); // get user ID from request body
    const productId = req.params.id; // get product ID from request params

    // find user's cart and product within cart
    const cart = await Cart.findOne({ userId: user1._id });
    const product = cart.products.find((p) => p.productId === productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    if (product.quantity === 1) {
      // if product quantity is 1, remove product from cart
      await Cart.updateOne({ userId: user1._id }, { $pull: { products: { productId: productId } } });
    } else {
      // subtract 1 from product quantity
      product.quantity -= 1;
      await cart.save();
    }

    res.status(200).json({ message: "Product quantity updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update product quantity" });
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
      await Cart.findOneAndDelete({ userId: req.params.id });
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

 