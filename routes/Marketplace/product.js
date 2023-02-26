const express = require('express')
const router = express.Router();
const Product = require('../../models/product')
const bodyparser = require("body-parser")
const productController = require('../../controller/productController');
const bcrypt = require("bcrypt"); 
const cookieParser = require("cookie-parser")

router.use(express.json())
router.use(cookieParser())

const { validateToken } = require('../JWT/JWT'); 

router.post("/addProduct",validateToken,productController.addProduct);
router.get("/getAllU",validateToken,productController.getAllproducts);
router.delete("/delete/:id",validateToken,productController.deleteproduct)
router.get("/getAllF", productController.getAll);
router.get("/getProduct/:id", productController.getProductById);
router.put("/update/:id",validateToken, productController.updateProduct);
router.delete("/deletee/:id", productController.deleteProduct);


/*
router.get("/getAll", productController.getAllProducts);

router.post("/add", productController.addNewProduct);
router.put("/update/:id", productController.updateProduct);
router.delete("/delete/:id", productController.deleteProduct);*/
const { sign, verify } = require('jsonwebtoken')


module.exports = router; 
