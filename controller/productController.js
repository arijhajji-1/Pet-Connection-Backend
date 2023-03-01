const express=require('express');
const Product = require("../models/product")
const User = require('../models/user');
const jwt = require('jsonwebtoken');


const { sign, verify } = require('jsonwebtoken')






//find avec category :http://localhost:3000/getAllF?category=aaa
//new=true w ta3tini 1 puisque limit(1):http://localhost:3000/getAllF?new=true
exports.getAll = async (req, res) => {
  const qNew = req.query.new;
  const qCategory = req.query.category;
  try {
      let products;
      if(qNew){
          products = await Product.find().sort({createdAt: -1}).limit(1)
      } else if(qCategory){
          products = await Product.find({categories:{
              $in: [qCategory],
          },
      });
      } else {
          products = await Product.find();
      }
      res.status(200).json(products);
  } catch (err){
      console.log(err);
  }
}

exports.getProductById = async (req, res) => {
  try {
    const data = await Product.findById(req.params.id);
    res.send(data)  
  } catch (error) {
    console.log(error);
  }
}

// POST a new product for a user
exports.addProduct = async  (req, res) => {
    
  const accessToken = req.cookies["access-token"];

  if (!accessToken) {
    return res.status(401).json({ message: "Access token not found" });
  }
 
    const decodedToken = verify(accessToken, "azjdn1dkd3ad");
     
    req.userId = decodedToken.id;
const user = await User.findById(req.userId );

  const newProduct = new Product({
    name: req.body.name,
    desc: req.body.desc,
    img: req.body.img,
    img: req.files.map((file) => file.filename),

    categories: req.body.categories,
    price: req.body.price,
    user: user,
  })
    try{
const savedProduct = await newProduct.save();
res.status(200).json(savedProduct)
    }catch(err){
        res.status(500).json(err);
    }
}


exports.updateProduct = async (req, res) => {
  const accessToken = req.cookies["access-token"];

  if (!accessToken) {
    return res.status(401).json({ message: "Access token not found" });
  }
 
    const decodedToken = verify(accessToken, "azjdn1dkd3ad");
     
    req.userId = decodedToken.id;
const user = await User.findById(req.userId );
  try {
    await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    await user.save();
    res.send("Product Updated")
  } catch (error) {
    console.log(error);
  }
}

exports.deleteProducts = async (req, res) => {
    console.log(req.params.id);

    // const prod = Product.findById(req.params.productId)
    //console.log(prod.name);
    Product.findByIdAndDelete({_id:req.params.id}).then(()=>{
      res.send("Product Deleted")

    }).catch((e)=>{console.log(e)});

}
 
//habtch t5dm baad ma knt t5dm
exports.deleteproduct = async  (req, res) => {
  try{
  const accessToken = req.cookies["access-token"];

  if (!accessToken) {
    return res.status(401).json({ message: "Access token not found" });
  }
 
    const decodedToken = verify(accessToken, "azjdn1dkd3ad");
     
    req.userId = decodedToken.id;
    const user =  User.findById(req.userId );
    console.log(req.userId);
    user.products.findByIdAndDelete({_id:req.params.id}).then(()=>{
      res.send("Product Deleted")
  
    }).catch((e)=>{console.log(e)});
  }

catch (error) {
  console.error(error);
  res.status(500).json({ error: 'Server error' });
}
}















/*exports.getAllProducts =  async (req, res) => {
  try {
    const data = await Product.find({});
    res.send(data);
  } catch (error) {
    console.log(error);
  }
}
exports.addNewProduct = async (req, res, next) => {
    const product = new Product(req.body);

    try{
        const savedProduct = await product.save();
        res.status(200).json(savedProduct)
    }catch (err){
        res.status(500).json(err);
    }
}
exports.updateProduct = async (req, res) => {
    try {
      await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.send("Product Updated")
    } catch (error) {
      console.log(error);
    }
  }
exports.deleteProduct = async (req, res) => {
    try {
      await Product.findByIdAndRemove(req.params.id);
      res.send("Product Deleted")
    } catch (error) {
      console.log(error);
    }
  }


*/