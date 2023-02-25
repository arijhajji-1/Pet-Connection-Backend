const express = require('express')
const router = express.Router();
const Product = require('../../models/product')
const bodyparser = require("body-parser")
const productController = require('../../controller/productController');

/*router.post("/add" , async (req, res) => {
    const product = new Product(req.body);

    try{
        const savedProduct = await product.save();
        res.status(200).json(savedProduct)
    }catch (err){
        res.status(500).json(err);
    }
});*/
router.get("/getAll", productController.getAllProducts);



module.exports = router; 
