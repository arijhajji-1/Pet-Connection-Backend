const Product = require("../models/product")
const User = require('../models/user');
const jwt = require('jsonwebtoken');


const { sign, verify } = require('jsonwebtoken')




// Get All only with user 
exports.getAllproducts = async  (req, res) => {
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
    const data = await Product.find({});
    res.send(data);
  } catch (error) {
    console.log(error);
  }
}

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
exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndRemove(req.params.Productid);
    res.status(200).json("Product Deleted")
  } catch (error) {
    res.status(500).json(error);
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

 
//habtch t5dm baad ma knt t5dm
exports.deleteproduct = async  (req, res) => {
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
  const product = await Product.findById(req.params.productId);
  if (!product) {
      return res.status(404).json({ error: 'product not found' });
    }
  // Remove the pet from the database
  await product.remove();

  // Save the user to update the pets array
  await user.save();
  res.json({ message: 'product deleted successfully' });

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