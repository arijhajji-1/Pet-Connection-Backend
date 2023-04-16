const express=require('express');
const router=express.Router();
const User = require('../../models/user')
const bodyparser = require("body-parser")
const controller=require("../../controller/petContoller")
const lostcontroller=require("../../controller/LostController")
const commentcontroller=require("../../controller/CommentLostController")
const bcrypt = require("bcrypt"); 
const cookieParser = require("cookie-parser")
const FormData = require('form-data');
router.use(express.json())
router.use(cookieParser())
const fs = require('fs');
const axios = require('axios');
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
router.post("/addlost",upload.array("image"),lostcontroller.addlostwithUser);
router.get("/getAllLostAndFound" ,lostcontroller.getAllLost);
router.post("/getAllLostAndFounduser" ,lostcontroller.getAllLostsuser);
router.post('/AllpetsByUser',controller.getAllpets);
router.delete('/deletepet/:id',controller.deletepet);
router.put('/updatepet/:id',controller.updatePetwithUser);
router.delete('/deletelostbuid/:id',lostcontroller.deleteLostById);
router.get('/lostbyid/:id',lostcontroller.getLostById);
router.delete('/deletelost/:id',commentcontroller.deletelost);
router.put('/updatelost/:id',lostcontroller.updatelost);
// comments 
router.post("/addcomments",commentcontroller.addcomment);
router.get('/comments', commentcontroller.getAllComments);
// adminn===========
router.get("/getallpets",controller.getAllPetsAdmin);
router.put("/updatepet",controller.updatePetAdmin);
router.delete("/deletepetadmin/:id",controller.deletepetAdmin);
router.put("/deletimagepet/:petId",controller.deletepetimgae);
//test django api 
router.post('/predict', upload.single('image'), (req, res) => {   
  const form = new FormData();
  form.append('image', fs.createReadStream(req.file.path), req.file.filename);
  axios.post('http://localhost:8000/pet/predict/', form, {
    headers: {
      ...form.getHeaders(),
    },
  })
  
    .then((response) => {
      console.log(response.data);
      res.json(response.data);
    })
    .catch((error) => {
      console.log(error);
      res.json({ error: 'Something went wrong.' });
    });
});
// get images 


router.get('/image/:id', (req, res) => {
  const imagePath = `./public/uploads/${req.params.id}`;
  const imageData = fs.readFileSync(imagePath);
  res.send(imageData);
});
 
module.exports=router;