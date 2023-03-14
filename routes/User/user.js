const express = require('express')
const router = express.Router();
const User = require('../../models/user')
const cookieParser = require("cookie-parser")
const bodyparser = require("body-parser")  
router.use(express.json())
router.use(cookieParser())


const { createToken, validateToken } = require('../../midill/JWT/JWT'); 
const { register, login, profile, getAll, updateuser, deleteUser, banUser, logout, upload, getUserImage,Userrecognize,regenize,uploadd,captureImage } = require("../../controller/UserController")


//===============upload image=======

// const multer = require("multer");

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "public/uploads");
//   },
//   // filename: function (req, file, cb) {
//   //   cb(null, Date.now() + "-" + file.originalname);
//   // },

//   // filename: function (req, file, cb) {
//   //   cb(null,file.originalname);
//   // },
// });




//const upload = multer({ storage: storage });





 // ========== routes

router.post("/register",register)

router.post("/login", login )

router.get("/all", getAll )

//
router.put("/updateuser/:id", upload.single("image"), updateuser)
router.get('/imageUser/:id/image',getUserImage) 



//




// router.put("/updateuser2/:id",  updateuser2)
router.delete("/delete/:id", validateToken, deleteUser)

router.get("/profile/:id", validateToken, profile )
 
router.get("/ban/:id", validateToken, banUser)

router.post('/logout', validateToken, logout);








/////////////////////////////////////

// router.post('/recognize', upload.single('image'), Userrecognize);

router.post('/detect', uploadd.none(),regenize);

router.post('/capture',captureImage);


/////////////



module.exports = router; 