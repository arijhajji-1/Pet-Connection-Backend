const express=require('express');
const router=express.Router();
const User = require('../../models/user')
const bodyparser = require("body-parser")
const controller=require("../../controller/petContoller")
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
router.get('/AllpetsByUser',validateToken,controller.getAllpets);
router.delete('/deletepet/:petId',validateToken,controller.deletepet);
router.put('/updatepet/:id',validateToken,controller.updatePetwithUser);

// router.post('/addpetwithUser', upload.array('images'), controller.addPetwithUser, (req, res) => {
//   const form = new FormData();
//   const firstImage = req.files[0]; // get the first image from the array
//   form.append('image', fs.createReadStream(firstImage.path), firstImage.filename); // append only the first image
//   axios.post('http://localhost:8000/pet/predict/', form, {
//     headers: {
//       ...form.getHeaders(),
//     },
//   })
//     .then((response) => {
//       console.log(response);
//       console.log("breed="+response.data);
//       res.json(response.data);
//     })
//     .catch((error) => {
//       console.log(error);
//       res.json({ error: 'Something went wrong.' });
//     });
// });



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
 
module.exports=router;