const express = require('express')
const router = express.Router();
const User = require('../../models/user')
const cookieParser = require("cookie-parser")
const bodyparser = require("body-parser")  
router.use(express.json())
router.use(cookieParser())

const FacebookStrategy = require("passport-facebook").Strategy;
const passport = require("passport");

const { createToken, validateToken } = require('../../midill/JWT/JWT'); 

const { register, login, profile, getAll, updateUser, deleteUser, banUser, logout,twofactorverification,disableTwoFactor,enableTwoFactor,facebooklogin , loginGoogle, promoteUser,updateuser,getUserImage,upload,passwordResetCtrl,forgetPasswordToken,updateUserPasswordCtrl,verifyUser,addUser,updateuseradmin } = require("../../controller/UserController")


 // ========== routes
 

 
router.post("/register", register)
router.get("/verify/:userId", verifyUser)
router.post("/login", login )

router.get("/all", getAll )

router.put("/update/:id", validateToken, updateUser)

// router.delete("/delete/:id", validateToken, deleteUser)

router.get("/profile/:id", validateToken, profile )
 
// router.get("/ban/:id", validateToken, banUser)

router.post('/logout', validateToken, logout);


router.post('/2fa/verify/:id', twofactorverification);
router.post('/2fa/enable/:id',enableTwoFactor);
router.post('/2fa/disable/:id', disableTwoFactor);
router.post('/facebook',facebooklogin);

router.post("/loginGoogle", loginGoogle);

router.put("/promote/:id", promoteUser);

router.put("/updateuser/:id", upload.single("image"), updateuser);
router.put("/updateuseradmin/:id", upload.single("image"), updateuseradmin);
router.get('/imageUser/:id/image',getUserImage);
/////////////////////////////////////


// router.post('/recognize', upload.single('image'), Userrecognize);
router.put("/password", validateToken, updateUserPasswordCtrl);

router.post("/forget-password-token", forgetPasswordToken);
// Password reset
router.put("/resetpassword", passwordResetCtrl);
router.post('/add',addUser)
router.delete("/delete/:id", deleteUser)
router.get("/ban/:id", banUser)
router.put("/update/:id", updateUser)

module.exports = router; 