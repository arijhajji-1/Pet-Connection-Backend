const express = require('express')
const router = express.Router();
const productController = require('../../controller/productController');
const cookieParser = require("cookie-parser")
const Product = require("../../models/product");


router.use(express.json())
router.use(cookieParser())
const multer = require("multer");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/uploads");
    },

    filename: function (req, file, cb) {
        cb(null,  Date.now()+file.originalname);
    },
});

var upload = multer({
    storage: storage
});

router.post("/add",upload.single('img'),async (req,res) => {
    let imgsrc = 'http://127.0.0.1:3000/uploads/' + req.file.filename;
    let product = new Product({
        name: req.body.name,
        desc: req.body.desc,
        img: imgsrc,
        categories: req.body.categories,
        price: req.body.price,
    });
    try{
        let savedProduct = await product.save();
        return res.status(200).json(savedProduct)
    }catch(err){
        console.log(err);
        return res.status(500).json(err);
    }
});
router.delete("/delete/:id",productController.delete);
router.get("/getAll", productController.getAll);
router.get("/get/:id", productController.findById);
router.put("/update", upload.single('img'), async (req,res)=>{
    let p=null;
    if(req.file){
        let imgsrc = 'http://127.0.0.1:3000/uploads/' + req.file.filename;
        p = {
            name: req.body.name,
            desc: req.body.desc,
            img: imgsrc,
            categories: req.body.categories,
            price: req.body.price,
        }
    }
    else{
        p ={
            name: req.body.name,
            desc: req.body.desc,
            img: req.body.img,
            categories: req.body.categories,
            price: req.body.price,
        };
    }

    console.log(await Product.findByIdAndUpdate(req.body._id,p))
    await Product.findOne({_id:req.body._id}).then((p)=>{
        return res.status(200).json(p);
    }).catch(err=>{
        return res.status(500).json(err);
    });
});




module.exports = router; 
