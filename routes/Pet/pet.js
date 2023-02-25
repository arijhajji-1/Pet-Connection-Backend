const express=require('express');
const router=express.Router();
const User = require('../../models/user')
const bodyparser = require("body-parser")
const controller=require("../../controller/petContoller")
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
router.post("/addpet",validateToken,controller.addPet);
router.post("/addpetwithUser",validateToken,upload.array("images"),controller.addPetwithUser);
router.get('/AllpetsByUser',validateToken,controller.getAllpets);
router.delete('/deletepet/:petId',validateToken,controller.deletepet);
const { sign, verify } = require('jsonwebtoken')
/*
//get user id from token 
const extractUserId = (req, res, next) => {
    const accessToken = req.cookies["access-token"];

    if (!accessToken) {
      return res.status(401).json({ message: "Access token not found" });
    }
   
      const decodedToken = verify(accessToken, "azjdn1dkd3ad");
       
      req.userId = decodedToken.id;
    next();
     
  };

//get user 

router.get("/user", extractUserId, async (req, res) => {
    const userId = req.userId; // retrieve user ID from request object
    const user = await User.findById(userId);
    res.json(user);
  });*/
module.exports=router;