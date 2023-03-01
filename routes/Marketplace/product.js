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
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });
router.post("/addProduct",validateToken,upload.array("img"),productController.addProduct);
router.delete("/delete/:id",validateToken,productController.deleteproduct)
router.get("/getAllF", productController.getAll);
router.get("/getProduct/:id", productController.getProductById);
router.put("/update/:id",validateToken, productController.updateProduct);
router.delete("/deletee/:id",productController.deleteProducts)


/*router.delete("/deletes/:id", async function(req,res){
  try{
      await Product.findByIdAndRemove(req.params.productId)
      res.send("Deleted");
  }catch(err){
      res.send(err)
  }
})

*/
const { sign, verify } = require('jsonwebtoken')


module.exports = router; 
