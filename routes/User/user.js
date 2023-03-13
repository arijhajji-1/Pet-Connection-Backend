const express = require('express')
const router = express.Router();
const User = require('../../models/user')
const cookieParser = require("cookie-parser")
const bodyparser = require("body-parser")  
router.use(express.json())
router.use(cookieParser())


const { createToken, validateToken ,authMiddleware} = require('../../midill/JWT/JWT'); 
const { register, login, profile, verifyUser,getAll, update, deleteUser, banUser, logout ,forgetPasswordToken,passwordResetCtrl,updateUserPasswordCtrl} = require("../../controller/UserController")
 // ========== routes

router.post("/register", register)

router.get("/verify/:userId", verifyUser)

router.post("/login", login )
router.post("/forget-password-token", forgetPasswordToken);
// Password reset
router.put("/reset-password", passwordResetCtrl);


router.get("/all", getAll )

router.put("/update/:id", validateToken, update)

router.delete("/delete/:id", validateToken, deleteUser)

router.get("/profile/:id", validateToken, profile )
 
router.get("/ban/:id", validateToken, banUser)

router.post('/logout', validateToken, logout);

router.put("/password", validateToken, updateUserPasswordCtrl);





module.exports = router; 