const express = require('express')
const router = express.Router();
const User = require('../../models/user')
const cookieParser = require("cookie-parser")
const bodyparser = require("body-parser")  
router.use(express.json())
router.use(cookieParser())


const { createToken, validateToken } = require('../../midill/JWT/JWT'); 
const { register, login, profile, getAll, update, deleteUser, banUser, logout, addUser, updateUser } = require("../../controller/UserController")

 // ========== routes

router.post("/register", register)

router.post("/login", login )

router.get("/all", getAll )





router.get("/profile/:id", validateToken, profile )
 


router.post('/logout', validateToken, logout);
// you have to add validateToken 

router.post('/add',addUser);
router.delete("/delete/:id", deleteUser)
router.post("/ban/:id", banUser);
router.put("/update/:id", updateUser)
module.exports = router; 