const express=require('express');
const router=express.Router();
const User = require('../../models/user')
const bodyparser = require("body-parser")
const controller=require("../../controller/petContoller")
const bcrypt = require("bcrypt"); 
const cookieParser = require("cookie-parser")

router.use(express.json())
router.use(cookieParser())

const { validateToken } = require('../../midill/JWT/JWT'); 
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
router.post("/addpet",controller.addPet);
router.post("/addpetwithUser",upload.array("images"),controller.addPetwithUser);
router.get('/AllpetsByUser',validateToken,controller.getAllpets);
router.delete('/deletepet/:petId',validateToken,controller.deletepet);
router.put('/updatepet/:id',validateToken,controller.updatePetwithUser);
 
 
module.exports=router;